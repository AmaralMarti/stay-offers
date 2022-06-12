import { CityController } from '../../controllers/cityController'
import { HotelController } from '../../controllers/hotelController'
import { OfferController } from '../../controllers/offerController'

import { Router } from 'express'

const router = Router()

router.get('/', CityController.getAll)
router.get('/:cityId', CityController.getById)
router.get('/:cityId/hotels', CityController.loadCity, HotelController.getAll)
router.get('/:cityId/hotels/:hotelId', CityController.loadCity, HotelController.getById)
router.get('/:cityId/hotels/:hotelId/offers', CityController.loadCity, HotelController.loadHotel, OfferController.getAll)
router.get('/:cityId/hotels/:hotelId/offers/:offerId', CityController.loadCity, HotelController.loadHotel, OfferController.getById)


export { router as CityRoutes }
