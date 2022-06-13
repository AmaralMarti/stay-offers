import { Request, Response } from 'express'
import { Types } from 'mongoose'
import { Hotel } from '../models/hotel'
import { Offer, OfferDoc } from '../models/offer'
import { Dictionary } from '../types/types'
import { BaseController, FilterType } from './baseController'

class OfferController extends BaseController {

    public static async getAll(request: Request, response: Response): Promise<void> {
        return await OfferController.getPaginatedData(request, response)
    }

    public static async getById(request: Request, response: Response): Promise<void> {
        const id = request.params.offerId

        const offer = await OfferController.loadEntity(id, response) as OfferDoc

        if (offer) {
            const hotelId = await OfferController.getHotelId(request)

            if (hotelId && offer.hotelId != hotelId) {
                response.status(400).json({
                    status: 400,
                    message: "Offer dont't belongs to Hotel",
                })

                return
            }

            response.status(200).json(offer)
        }
    }

    private static async getHotelId(request: Request): Promise<string|null> {
        const hotelId = request.params.hotelId

        if (!hotelId) {
            return null
        }

        const objectId = new Types.ObjectId(hotelId)
        const hotel = await Hotel.findOne({_id: objectId})

        if (!hotel) {
            return null
        }

        return hotel.hotelId
    }

    protected static getModel(): any {
        return Offer
    }

    protected static getModelLabel(): string {
        return 'Offer'
     }

    protected static getFilters(): Dictionary[] {
        return [
            { name: 'id', alias: '_id', type: FilterType.ObjectId },
            { name: 'offerId', type: FilterType.String },
            { name: 'hotelId', type: FilterType.String },
            { name: 'checkInDate', type: FilterType.Date },
            { name: 'checkOutDate', type: FilterType.Date },
            { name: 'description', type: FilterType.String },
            { name: 'adults', type: FilterType.Number },
            { name: 'currency', type: FilterType.String },
            { name: 'totalPrice', type: FilterType.Number },
        ]
    }
}

export { OfferController }
