import { Request, Response, Router } from 'express'
import { CityRoutes } from './cityRoutes';
import { HotelRoutes } from './hotelRoutes';
import { OfferRoutes } from './offerRoutes'
import { SyncRoutes } from './syncRoutes'

const router = Router()

router.get('/', (request: Request, response: Response) => {
    response.send(`<html><head><title>Teste</title></head><body><h1>This is an API</h1><h2>Version 1</h2></body></html>`)
})

router.use('/sync-data', SyncRoutes)

router.use('/cities', CityRoutes)
router.use('/hotels', HotelRoutes)
router.use('/offers', OfferRoutes)

export { router as RouterV1 }
