import { NextFunction, Request, Response } from 'express'
import { City, CityDoc } from '../models/city'
import { BaseController, FilterType } from './baseController'
import { Dictionary } from '../types/types'

class CityController extends BaseController {
    public static async getAll(request: Request, response: Response): Promise<void> {
        await CityController.getPaginatedData(request, response)
    }

    public static async getById(request: Request, response: Response): Promise<void> {
        const id = request.params.cityId

        const city = await CityController.loadEntity(id, response) as CityDoc

        if (city) {
            response.status(200).json(city)
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

    protected static getFilters(): Dictionary[] {
        return [
            { name: 'id', alias: '_id', type: FilterType.ObjectId },
            { name: 'cityCode', type: FilterType.String},
            { name: 'name', type: FilterType.String},
            { name: 'countryName', type: FilterType.String},
            { name: 'countryCode', type: FilterType.String},
            { name: 'latitude', type: FilterType.Number},
            { name: 'longitude', type: FilterType.Number},
        ]
    }

}

export { CityController }
