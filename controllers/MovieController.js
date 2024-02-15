import { MovieModel } from '../models/movie.js'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'

export class MovieController {
  static async getAll(req, res) {
    const { genre } = req.query
    const movies = await MovieModel.getAll({ genre });
  
    res.json(movies) 
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const movie = await MovieModel.getById({ id })
  
      if(movie != null)
        return res.json(movie)
  
      res.status(404).json({message: 'Movie not found'})
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async create(req, res) {
    try {
      const result = validateMovie(req.body)
  
      if(result.error)
        return res.status(400).json({error: JSON.parse(result.error.message)})
  
      const newMovie = await MovieModel.create({ input: result.data })
  
      res.status(201).json(newMovie)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params
      const resultValidation = validatePartialMovie(req.body);
  
      if(resultValidation.error) return res.status(400).json({error: JSON.parse(resultValidation.error.message)})
  
      const result = await MovieModel.update({id, input: resultValidation.data})
  
      if(!result.success) return res.status(404).json({ message: result.message })
  
      res.json(result.data)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params
      const movieDeleted = await MovieModel.delete({ id })
  
      if(!movieDeleted) return res.status(404).json({message: 'Movie not found.'})
  
      res.status(200).json({message: 'Movie deleted'})
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}