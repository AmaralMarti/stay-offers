import { SyncController } from '../../controllers/sync'
import { Router } from 'express'

const router = Router()

router.get('/', SyncController.syncAll)

export { router as SyncRoutes }
