import { NextFunction, Request, Response } from 'express'
import { Amadeus } from '../services/amadeus'
import { Application } from '../services/application'


class SyncController {
    private static api: Amadeus
    
    private static cityList = [
        'NEW YORK',
        'LONDON',
        'MIAMI'
    ]
    
    private static getApi(): Amadeus {
        if (!this.api) {            
            this.api = new Amadeus(Application.parameters.api)
        }        

        return this.api
    }
    
    private static async syncCities(city: string): Promise<void> {
        const cities = await this.getApi().searchCity(city)

        console.log(cities)
    }
    
    public static async syncAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            for (const city of SyncController.cityList) {
                await SyncController.syncCities(city)
            }
        } catch (e: any) {
            console.log(e)
            next(e)
        }
    }
}
 
export { SyncController }
