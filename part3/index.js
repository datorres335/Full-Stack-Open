require('dotenv').config() // this will load the environment variables from the .env file
const express = require('express')
const app = express()
app.use(express.static('dist')) //this will serve the static files from the 'dist' folder, so that the frontend can be served from the same server
app.use(express.json()) //used to convert json data into a javascript object, used in post requests

const cors = require('cors') //don't need cors middleware anymore. Uninstall it with "npm remove cors"
app.use(cors())

const Person = require('./models/person') //used to connect to the MongoDB database and use the Person model,

const morgan = require('morgan')
//app.use(morgan('tiny')) //tiny is a predefined format in morgan, it will log the request method, url, and response status code
morgan.token('body', (req) => {
    return req.body ? JSON.stringify(req.body) : ''
})
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
    { 
        "id": "5",
        "name": "Test Delete", 
        "number": "999-99-9989"
    }
]

app.get('/info', (request, response) => { // http://localhost:3001/info
    const date = new Date()
    const numOfPeople = `Phonebook has info for ${persons.length} people`
    response.send(
        `<p>${numOfPeople}<p/>
        <p>${date}</p>`
    )
    //response.send('<h1>Whats up world?</h1>')
})

app.get('/', (request, response) => {  // http://localhost:3001
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => { // http://localhost:3001/api/persons
    //response.json(persons)
    Person.find({}).then(persons => {      
        response.json(persons)
    }).catch(error => {
        console.log('Error fetching data from mongoDB:', error.message)
        response.status(500).json({
            error: 'Failed to fetch data from the database'
        })
    })
})

//this allows users to get the info of a specific person by their id
app.get('/api/persons/:id', (request, response) => {
    // const id = request.params.id
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }

    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
    // const id = request.params.id
    // persons = persons.filter(person => person.id !== id)
    // response.status(204).end()
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// const generatedId = () => {
//     const maxId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 6 + 1)) + 6;

//     return String(maxId + 1)
// }

const nameExists = (name) => {
    return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (nameExists(body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    // const person = {
    //     id: generatedId(),
    //     name: body.name,
    //     number: body.number
    // }
    // persons = persons.concat(person)

    // response.json(person)
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedNote => {
        response.json(savedNote)
    })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint) // Handles requests to unknown endpoints

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
app.use(errorHandler) // Handles errors

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})