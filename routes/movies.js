import { Router } from 'express'
import { MovieController } from '../controllers/MovieController.js'

const createMovieRoute = ({ movieModel }) => {
  const router = Router()

  const movieController = new MovieController({ movieModel: movieModel })

  router.get('/', movieController.getAll)
  router.get('/:id', movieController.getById)
  router.post('/', movieController.create)
  router.patch('/:id', movieController.update)
  router.delete('/:id', movieController.delete)

  return router
}

export { createMovieRoute }