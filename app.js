import express, { json } from 'express'
import cors from 'cors'
import moviesRouter from './routes/movies.js'
import { corsMiddleWare } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by')

app.use(json())
app.use(corsMiddleWare())

app.use('/movies', moviesRouter)

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`server listening on PORT http://localhost:${PORT}`)
})