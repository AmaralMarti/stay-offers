import { Request, Response } from 'express'
import { Amadeus } from '../services/amadeus'
import { City} from '../models/city'
import { Application } from '../services/application'

const controller = {
    searchCity: async (request: Request, response: Response) => {
        const { keyword } = request.query

        const amadeus = new Amadeus(Application.parameters.api)
        //const data = await amadeus.searchCity(keyword as string)
        //const data = await amadeus.getHotelsByCity('NYC')
        //const data = await amadeus.getOffersByHotel('AKNYCLXA')
        const data = await amadeus.getOffersByHotel('RTPAR001')        
        
        response.status(200).json({ data })
    },

    getHotelsByCity: async (request: Request, response: Response) => {
        const { keyword } = request.query

        const amadeus = new Amadeus(Application.parameters.api)
        const data = await amadeus.searchCity(keyword as string)
        
        response.status(200).json({ data })
    }    
}
 
export { controller as Controller }