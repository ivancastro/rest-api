import { Router } from 'express'
import { MovieController } from '../controllers/MovieController.js'

const router = Router()

router.get('/', MovieController.getAll)
router.get('/:id', MovieController.getById)
router.post('/', MovieController.create)
router.patch('/:id', MovieController.update)
router.delete('/:id', MovieController.delete)

export default router