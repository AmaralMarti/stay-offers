import { NextFunction, Request, Response } from 'express'
import { City, ICity } from '../models/city'
import { Hotel } from '../models/hotel'
import { Offer } from '../models/offer'
import { Amadeus } from '../services/amadeus'
import { Application } from '../services/application'


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
            await SyncController.processCities()
            await SyncController.processHotels()
            await SyncController.processOffers()

            response.status(200).json({ allData: 'ok' })
        } catch (e: any) {
            next(e)
        }
    }

    public static async syncCities(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            await SyncController.processCities()

            response.status(200).json({ cities: 'ok' })
        } catch (e: any) {
            next(e)
        }
    }

    public static async syncHotels(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            await SyncController.processHotels()

            response.status(200).json({ hotels: 'ok' })
        } catch (e: any) {
            next(e)
        }
    }

    public static async syncOffers(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            await SyncController.processOffers()

            response.status(200).json({ offers: 'ok' })
        } catch (e: any) {
            next(e)
        }
    }

    private static async processCities(): Promise<void> {
        await City.deleteMany({})
        for (const city of SyncController.cityList) {
            await SyncController.processCity(city)
        }
    }

    private static async processCity(city: string): Promise<void> {
        const cities = await this.getApi().searchCity(city)

        cities.forEach((cityData: ICity) => {
            const city = City.build(cityData)
            city.save()
        })
    }

    private static async processHotels(): Promise<void> {
        await Hotel.deleteMany({})

        const cities = await City.find({})

        for (const city of cities) {
            await SyncController.processHotel(city.cityCode)
        }
    }

    private static async processHotel(cityCode: string): Promise<void> {
        const hotels = await this.getApi().getHotelsByCity(cityCode)

        for (const hotelData of hotels) {
            const hotel = Hotel.build(hotelData)
            hotel.save()
        }
    }

    private static async processOffers(): Promise<void> {
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
    }

    private static async processOffer(hotelId: string): Promise<void> {
        const offers = await this.getApi().getOffersByHotel(hotelId)

        for (const offerData of offers) {
            const offer = Offer.build(offerData)
            offer.save()
        }
    }
}

async function wait(milliseconds: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export { SyncController }
