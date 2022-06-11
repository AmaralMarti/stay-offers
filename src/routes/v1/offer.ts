import { Controller } from '../../controllers/offer'
import { Router } from 'express'

const router = Router()

router.get('/', Controller.getOffersByHotel)

export { router as OffersRoutes }
