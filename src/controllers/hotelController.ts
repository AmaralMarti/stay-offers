import { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import { City } from '../models/city'
import { Hotel, HotelDoc } from '../models/hotel'
import { Dictionary } from '../types/types'
import { BaseController, FilterType } from './baseController'

class HotelController extends BaseController {

    public static async getAll(request: Request, response: Response): Promise<void> {
        return await HotelController.getPaginatedData(request, response)
    }

    public static async getById(request: Request, response: Response): Promise<void> {
        const id = request.params.hotelId

        const hotel = await HotelController.loadEntity(id, response) as HotelDoc

        if (hotel) {
            const cityCode = await HotelController.getCityCode(request)

            if (cityCode && hotel.cityCode != cityCode) {
                response.status(400).json({
                    status: 400,
                    message: "Hotel dont't belongs to City",
                })

                return
            }

            response.status(200).json(hotel)
        }
    }

    public static async loadHotel(request: Request, response: Response, next: NextFunction): Promise<void> {
        const id = request.params.hotelId as string

        const hotel = await HotelController.loadEntity(id, response)

        if (hotel) {
            next()
        }
    }

    private static async getCityCode(request: Request): Promise<string|null> {
        const cityId = request.params.cityId

        if (!cityId) {
            return null
        }

        const objectId = new Types.ObjectId(cityId)
        const city = await City.findOne({_id: objectId})

        if (!city) {
            return null
        }

        return city.cityCode
    }

    protected static getModel(): any {
        return Hotel
    }

    protected static getModelLabel(): string {
        return 'Hotel'
     }

    protected static getFilters(): Dictionary[] {
        return [
            { name: 'id', alias: '_id', type: FilterType.ObjectId },
            { name: 'hotelId', type: FilterType.String },
            { name: 'name', type: FilterType.String },
            { name: 'cityCode', type: FilterType.String },
            { name: 'latitude', type: FilterType.Number },
            { name: 'longitude', type: FilterType.Number },
        ]
    }
}

export { HotelController }
