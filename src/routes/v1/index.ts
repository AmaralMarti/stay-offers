import { Request, Response, Router } from 'express'
import { CityRoutes } from './city';
import { SearchRoutes } from './search'
import { OffersRoutes } from './offer'
import { SyncRoutes } from './sync'

const router = Router()

router.get('/', (request: Request, response: Response) => {
    response.send(`<html><head><title>Teste</title></head><body><h1>This is an API</h1><h2>Version 1</h2></body></html>`)
})

router.use('/search', SearchRoutes)
router.use('/offers', OffersRoutes)
router.use('/sync-data', SyncRoutes)

router.use('/cities', CityRoutes)
router.use('/cities/:cityId', SearchRoutes)
router.use('/cities/:cityId/hotels', SearchRoutes)
router.use('/cities/:cityId/hotels/:hotelId', SearchRoutes)
router.use('/cities/:cityId/hotels/:hotelId/offers', SearchRoutes)
router.use('/cities/:cityId/hotels/:hotelId/offers/:offerId', SearchRoutes)

export { router as RouterV1 }