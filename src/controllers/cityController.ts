import { NextFunction, Request, Response } from 'express'
import { City } from '../models/city'
import { BaseController } from './baseController'

class CityController extends BaseController {
    public static async getAll(request: Request, response: Response): Promise<void> {
        const cities = await City.find({})

        response.status(200).json(cities)
    }

    public static async getById(request: Request, response: Response): Promise<void> {
        const id = request.params.cityId

        const hotel = await CityController.loadEntity(id, response)

        if (hotel) {
            response.status(200).json(hotel)
        }
    }

    public static async loadCity(request: Request, response: Response, next: NextFunction): Promise<void> {
        const id = request.params.cityId

        const city = await CityController.loadEntity(id, response)

        if (city) {
            next()
        }
    }

    protected static getModel(): any {
        return City
    }

    protected static getModelLabel(): string {
        return 'City'
    }
}

export { CityController }
