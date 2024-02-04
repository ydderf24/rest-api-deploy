const express = require('express')
const crypto = require('node:crypto')
const movies = require('./movies.json')
const { validate, validatePartial } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.disable('x-powered-by')
// eslint-disable-next-line no-undef


//Get para filtrar peliculas por genero
app.get('/movies', (req, res) => {
    const { genre, year, title } = req.query
    if (genre) {
        const filteredMoviesGenre = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
        if(filteredMoviesGenre.length > 0) {
            return res.json(filteredMoviesGenre) 
        } else{
            return res.status(404).json({ message: 'Movie genre not found' })
        }
    }
    else if(year) {
        const filteredMoviesYear = movies.filter(movie => movie.year == year)
        if(filteredMoviesYear.length > 0) {
            return res.json(filteredMoviesYear)
        }   else{
            return res.status(404).json({ message: 'Movie year not found' })
        }
    }
    else if(title) {
        const filteredMoviesName = movies.filter(
            movie => movie.title.toLowerCase().startsWith(title.toLowerCase())
        ) 
        if(filteredMoviesName.length > 0) {
            return res.json(filteredMoviesName)
        } else{
            return res.status(404).json({ message: 'Movie name not found' })
        }
    }
    res.json(movies)
})

//Get para filtra por ID
app.get('/movies/:id', (req, res) => {
    const id = req.params.id
    const movie = movies.find((movie) => movie.id == id)

    if (movie) {
        return res.json(movie)
    } else {
        return res.status(404).json({ message: 'Movie not found' })
    }
})


//Post para crear una pelicula  
app.post('/movies', (req, res) => {
   
    const result =  validate(req.body)
    if (!result.success) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const newMovie = {
        id: crypto.randomUUID(),
        ...result.data
    }     
    movies.push(newMovie)
    res.status(201).json(newMovie)
})

//Patch para editar una pelicula existente
app.patch('/movies/:id', (req, res) => {
    const result = validatePartial(req.body)
  
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
  
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }
  
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data
    }
  
    movies[movieIndex] = updateMovie
  
    return res.json(updateMovie)
})

app.delete('/movies/:id', (req, res) => {
    const { id } = req.params
    const movieIndex = movies.findIndex(movie => movie.id === id)
  
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' })
    }
  
    movies.splice(movieIndex, 1)
  
    return res.json({ message: 'Movie deleted successfully' })
})

// eslint-disable-next-line no-undef
const port = process.env.port ?? 1234

app.listen(port, () => {
    console.log('Ingresa a http://localhost:' + port)
})
