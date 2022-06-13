import { NextFunction, Request, Response } from 'express'
import { City, ICity } from '../models/city'
import { Hotel } from '../models/hotel'
import { Offer } from '../models/offer'
import { Sync } from '../models/sync'
import { Amadeus } from '../services/amadeus'
import { Application } from '../services/application'
import { Dictionary } from '../types/types'


class SyncController {
    private static api: Amadeus

    private static cityList = [
        'NEW YORK',
        'LONDON',
        'MIAMI'
    ]

    private static hotelListLength = 150

    private static getApi(): Amadeus {
        if (!this.api) {
            this.api = new Amadeus(Application.parameters.api)
        }

        return this.api
    }

    public static async syncAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const syncIsRunning = await SyncController.syncIsRunning(response)

            if (syncIsRunning) {
                return
            }

            SyncController.processAllData()

            response.status(200).json({
                status: 'ok',
                message: 'Working. The process can take up to 3 minutes'
            })
        } catch (e: any) {
            next(e)
        }
    }

    public static async syncCities(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const syncIsRunning = await SyncController.syncIsRunning(response)

            if (syncIsRunning) {
                return
            }

            SyncController.processCities()

            response.status(200).json({
                status: 'ok',
                message: 'Working. The process can take up to 1 minutes'
            })
        } catch (e: any) {
            next(e)
        }
    }

    public static async syncHotels(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const syncIsRunning = await SyncController.syncIsRunning(response)

            if (syncIsRunning) {
                return
            }

            SyncController.processHotels()

            response.status(200).json({
                status: 'ok',
                message: 'Working. The process can take up to 2 minutes'
            })
        } catch (e: any) {
            next(e)
        }
    }

    public static async syncOffers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const syncIsRunning = await SyncController.syncIsRunning(response)

            if (syncIsRunning) {
                return
            }

            SyncController.processOffers()

            response.status(200).json({
                status: 'ok',
                message: 'Working. The process can take up to 2 minutes'
            })
        } catch (e: any) {
            next(e)
        }
    }

    private static async processAllData(): Promise<void> {
        try {
            await SyncController.startSync('all data')

            await SyncController.processCities(true)
            await SyncController.processHotels(true)
            await SyncController.processOffers(true)
        } finally {
            await SyncController.stopSync()
        }
    }

    private static async processCities(nested: boolean = false): Promise<void> {
        try {
            await SyncController.startSync('Cities', nested)

            await City.deleteMany({})
            for (const city of SyncController.cityList) {
                await SyncController.processCity(city)
            }
        } finally {
            await SyncController.stopSync(nested)
        }
    }

    private static async processCity(city: string): Promise<void> {
        const cities = await this.getApi().searchCity(city)

        cities.forEach((cityData: ICity) => {
            const city = City.build(cityData)
            city.save()
        })
    }

    private static async processHotels(nested: boolean = false): Promise<void> {
        try {
            await SyncController.startSync('Hotels', nested)

            await Hotel.deleteMany({})

            const cities = await City.find({})

            for (const city of cities) {
                await SyncController.processHotel(city.cityCode)
            }
        } finally {
            await SyncController.stopSync(nested)
        }
    }

    private static async processHotel(cityCode: string): Promise<void> {
        const hotels = await this.getApi().getHotelsByCity(cityCode)

        for (const hotelData of hotels) {
            const hotel = Hotel.build(hotelData)
            hotel.save()
        }
    }

    private static async processOffers(nested: boolean = false): Promise<void> {
        try {
            await SyncController.startSync('Offers', nested)

            await Offer.deleteMany({})

            const hotels = await Hotel.find({})

            let hotelList: string[] = []
            for (const hotel of hotels) {
                hotelList.push(hotel.hotelId)

                if (hotelList.length == SyncController.hotelListLength) {
                    const hotelIds = hotelList.join(',')
                    hotelList = []

                    await SyncController.processOffer(hotelIds)
                }
            }

            if (hotelList.length > 0) {
                const hotelIds = hotelList.join(',')

                await SyncController.processOffer(hotelIds)
            }
        } finally {
            await SyncController.stopSync(nested)
        }
    }

    private static async processOffer(hotelId: string): Promise<void> {
        const offers = await this.getApi().getOffersByHotel(hotelId)

        for (const offerData of offers) {
            const offer = Offer.build(offerData)
            offer.save()
        }
    }

    private static async syncIsRunning(response: Response): Promise<boolean> {
        const syncStatus = await SyncController.getSyncStatus()

        if (syncStatus.processing) {
            response.status(200).json({
                status: 'working',
                message: `Syncing ${syncStatus.model}, wait for completion `
            })
        }

        return syncStatus.processing
    }

    private static async getSyncStatus(): Promise<Dictionary> {
        const sync = await Sync.findOne({})

        let status = {
            processing: false,
            model: ''
        }

        if (sync) {
            status.processing = sync.processing
            status.model = sync.model
        }

        return status
    }

    private static async startSync(model: string, nested: boolean = false): Promise<void> {
        if (nested) {
            return
        }

        console.log({
            processing: true,
            model
        })

        const sync = Sync.build({
            processing: true,
            model
        })

        await sync.save()
    }

    private static async stopSync(nested: boolean = false): Promise<void> {
        if (nested) {
            return
        }

        await Sync.deleteMany({})
    }
}

export { SyncController }
