import mysql from 'mysql2/promise'

const DEFAULT_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: 'sql2022',
  port: 3306,
  database: 'apirest'
}

const config = process.env.DATABASE_URL ?? DEFAULT_CONFIG

const connection = await mysql.createConnection(config)

export class MovieModel {
  static async getAll({ genre }) {
    if(genre) {
      const lowerGenre = genre.toLowerCase()
      const [movies, tableInfo] = await connection.query(
        `select BIN_TO_UUID(m.id) id, title, year, director, duration, poster, rate from movies m 
        join movies_genres mv on m.id = mv.movie_id
        join genres g on g.id = mv.genre_id
        where lower(g.name) = ?;`, [lowerGenre]
      )

      return movies
    }

    const [movies, tableInfo] = await connection.query(
      'select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movies;'
    )

    return movies
  }

  static async getById({ id }) {
    const [movies, tableInfo] = await connection.query(
      'select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movies m where m.id = UUID_TO_BIN(?);',
      [id]
    )

    if(movies.length === 0) return null

    return movies[0]
  }

  static async create({ input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster
     } = input

    const[uuidResult] = await connection.query('SELECT UUID() uuid;')
    const[{uuid}] = uuidResult

    try {
      const result = await connection.query(`
        INSERT INTO movies (id, title, year, director, duration, poster, rate)
        VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);
      `, [title, year, director, duration, poster, rate])

      const [movie, tableInfo] = await connection.query(
        'select BIN_TO_UUID(id) id, title, year, director, duration, poster, rate from movies m where m.id = UUID_TO_BIN(?);',
        [uuid]
      )

      return movie[0]
    } catch (e) {
      throw new Error('Error creating movie')
    }
  }

  static async update({id, input}) {
  }

  static async delete({ id }) {
    try {
      const [result, tableInfo] = await connection.query(`
        DELETE FROM movies where BIN_TO_UUID(id) = ?
      `, [id])
      
      if(result.affectedRows === 0) return false
      
      return true
    } catch (e) {
      return false
    }
  }
}