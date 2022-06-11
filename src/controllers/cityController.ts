import { NextFunction, Request, Response } from 'express'
import { Amadeus } from '../services/amadeus'
import { City} from '../models/city'

class CityController {
    public static async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
        console.log('city 001', next)
        //next({statusCode: 200, data: {teste: 123}})
        next()
    }

    public static async getById(request: Request, response: Response, next: NextFunction): Promise<void> {
        console.log('city 002')
        next()
        // next({statusCode: 302, data: {blabla: 'qwerty'}})
    }

    // public static async sendResponse(err: any, request: Request, response: Response): Promise<void {
    //     console.log('aqui 1')
    //     // return response.status(err.statusCode).json(err.data)
    // }
}

// const controller = {
//     getAll: async (request: Request, response: Response) => {
//         const { keyword } = request.query

//         const amadeus = new Amadeus()
//         const data = await amadeus.searchCity(keyword as string)
        
//         response.status(200).json({ data })
//     },

//     getById: async (request: Request, response: Response) => {
//         const { keyword } = request.query

//         const amadeus = new Amadeus()
//         const data = await amadeus.searchCity(keyword as string)
        
//         response.status(200).json({ data })
//     },


//     redirectParams: (request: Request, response: Response, next: NextFunction) => {
//         const parentParams = request.parentParams || {}
      
//         parentParams.notificationId = parseInt(req.params.notificationId)
      
//         req.parentParams = parentParams
//         next() 
//     },
    
//     validateParams: async (request: Request, response: Response, next: NextFunction) => {
//         try {
//             const appId = req.parentParams.appId
//             const notificationId = req.params.notificationId
        
//             const notification = await Notifications.getNotificationById(notificationId)
        
//             if (!notification) {
//               return res.status(404).json({ error: `The notification id ${notificationId} couldn't be found.` })
//             }
        
//             if (notification.application.id !== appId) {
//               return res.status(403).json({ error: `The notification id ${notificationId} does not belong to that application` })
//             }
        
//             next()
//           } catch(e: any) {
//             next(e)
//           }        
//     }
// }
 
export { CityController }