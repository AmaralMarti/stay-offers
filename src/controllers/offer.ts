import { Request, Response } from 'express'
import { Amadeus } from '../services/amadeus'
import { Application } from '../services/application'

export type offersParams = {
    cityCode: string
    adults: number
    checkInDate: Date
    checkOutDate: Date
}

const controller = {
    getOffersByHotel: async (request: Request, response: Response) => {
        const cityCode = request.query.cityCode as string
        const adults = request.query.adults as unknown as number ?? null
        const checkInDate = new Date(request.query.checkInDate as string) ?? null
        const checkOutDate = new Date(request.query.checkOutDate as string) ?? null

        const amadeus = new Amadeus(Application.parameters.api)
        const data = await amadeus.getOffersByHotel(cityCode)
        
        response.status(200).json({ data })
    }
 
}

export { controller as Controller }
 
// function getParams(request: express.Request): offerParams {
//     const cityCode = request.query.cityCode as string ?? null
//     let adults = request.query.adults as string ?? null
//     let checkInDate = request.query.checkInDate as string ?? null

//     const errors: string[] = []
//     if (!cityCode) {
//         errors.push('Required parameter "cityCode" not sent')        
//     }

//     if (errors.length > 0) {        
//         throw new Error(errors.toString());        
//     }

//     adults = adults ?? 1
//     checkInDate = new Date(checkInDate) ?? new Date()

//     return {
//         cityCode,
//         adults,
//         checkInDate,
//     }
// }