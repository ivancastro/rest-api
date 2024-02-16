import express, { json } from 'express'
import { createMovieRoute } from './routes/movies.js'
import { corsMiddleWare } from './middlewares/cors.js'
import 'dotenv/config.js'

const createApp = ({ movieModel }) => {
  const app = express()
  app.disable('x-powered-by')

  app.use(json())
  app.use(corsMiddleWare())

  app.use('/movies', createMovieRoute({ movieModel }))

  const PORT = process.env.PORT ?? 3000
  app.listen(PORT, () => {
    console.log(`server listening on PORT http://localhost:${PORT}`)
  })
}

export {
  createApp
}
