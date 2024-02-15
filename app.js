const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const movies = require('./data/movies.json')

const app = express()
app.disable('x-powered-by')

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1242',
      'https://movies.com'
    ]

    if(ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

app.get('/', (req,res) => {
  res.json({message: 'Hello World'})
})

app.get('/movies', (req, res) => {
  const { genre } = req.query

  if(genre) {
    const filteredMovies = movies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase()))
    
    if(filteredMovies.length > 0)
      res.json(filteredMovies)

    res.status(404).json({message:'Movies not found'})
  }

  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find(m => m.id == id);

  if(movie != null)
    res.json(movie)

  res.status(404).json({message: 'Movie not found'})
})

app.post('/movies', (req, res) => {
  
  const result = validateMovie(req.body)

  if(result.error)
    res.status(400).json({error: JSON.parse(result.error.message)})
  const {
    id,
    title,
    year,
    director,
    duration,
    poster,
    genre,
    rate
  } = req.body

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const indexMovie = movies.findIndex(m => m.id === id)
  if(indexMovie === -1) res.status(404).json({message: 'Movie not found.'})

  const result = validatePartialMovie(req.body);

  if(result.error) res.status(400).json({error: JSON.parse(result.error.message)})

  const updatedMovie = {
    ...movies[indexMovie],
    ...result.data
  }

  movies[indexMovie] = updatedMovie

  res.json(movies[indexMovie])
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(m => m.id === id)

  if(movieIndex === -1) res.status(404).json({message: 'Movie not found.'})

  movies.splice(movieIndex, 1)

  res.status(200).json({message: 'Movie deleted'})
})

const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
  console.log(`server listening on PORT http://localhost:${PORT}`)
})