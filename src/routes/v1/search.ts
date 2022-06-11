import { Controller } from '../../controllers/location'
import { Router } from 'express'

const router = Router()

router.get('/city', Controller.searchCity)

export { router as SearchRoutes }
