import { createRequire } from 'node:module'
import { randomUUID } from 'node:crypto'
const require = createRequire(import.meta.url)
const movies = require('../../data/movies.json')

export class MovieModel {
  static async getAll({ genre }) {
    if(genre) {
      return movies.filter(m => m.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase()))
    }

    return movies
  }

  static async getById({ id }) {
    const movie = movies.find(m => m.id == id);
    return movie
  }

  static async create({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    movies.push(newMovie)

    return newMovie
  }

  static async update({id, input}) {
    const indexMovie = movies.findIndex(m => m.id === id)
    let result = {
      success: true,
      message: '',
      data: {}
    }

    if(indexMovie === -1) {
      result.success = false
      result.message = 'Movie not found.'
      result.data = { ...input }
      
      return result
    }

    const updatedMovie = {
      ...movies[indexMovie],
      ...input
    }

    movies[indexMovie] = { ...updatedMovie }
    result.data = { ...movies[indexMovie] }

    return result
  }

  static async delete({ id }) {
    const movieIndex = movies.findIndex(m => m.id === id)

    if(movieIndex === -1) return false

    movies.splice(movieIndex, 1)
    return true
  }
}