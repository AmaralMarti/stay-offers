import { SyncController } from '../../controllers/syncController'
import { Router } from 'express'

const router = Router()

router.get('/', SyncController.syncAll)
router.get('/cities', SyncController.syncCities)
router.get('/hotels', SyncController.syncHotels)
router.get('/offers', SyncController.syncOffers)

export { router as SyncRoutes }
