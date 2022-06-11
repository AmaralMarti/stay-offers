import { CityController } from '../../controllers/cityController'
import { Router } from 'express'

const router = Router()

router.get('/', CityController.getAll)
router.get('/:id', CityController.getById)
router.get('/:id/hotels', CityController.getById, )

export { router as CityRoutes }
