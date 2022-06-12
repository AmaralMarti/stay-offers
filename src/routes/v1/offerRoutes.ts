import { OfferController } from '../../controllers/offerController'
import { Router } from 'express'

const router = Router()

router.get('/', OfferController.getAll)
router.get('/:offerId', OfferController.getById)

export { router as OfferRoutes }
