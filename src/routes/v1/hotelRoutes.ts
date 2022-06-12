import { HotelController } from '../../controllers/hotelController'
import { Router } from 'express'
import { OfferController } from '../../controllers/offerController'

const router = Router()

router.get('/', HotelController.getAll)
router.get('/:hotelId', HotelController.getById)
router.get('/:hotelId/offers', HotelController.loadHotel, OfferController.getAll)
router.get('/:hotelId/offers/:offerId', HotelController.loadHotel, OfferController.getById)

export { router as HotelRoutes }
