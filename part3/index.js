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

app.get('/info', (request, response, next) => { // http://localhost:3001/info
    const date = new Date()
    Person.countDocuments({})
        .then(count => {
            const numOfPeople = `Phonebook has info for ${count} people`
            response.send(
                `<p>${numOfPeople}</p>
                <p>${date}</p>`
            )
        })
        .catch(error => next(error))
})

app.get('/', (request, response) => {  // http://localhost:3001
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => { // http://localhost:3001/api/persons
    Person.find({})
        .then(persons => {      
            response.json(persons)
        })
        .catch(error => next(error))
})

//this allows users to get the info of a specific person by their id
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (persons) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const nameExists = (name) => {
    return persons.some(person => person.name === name)
}

app.post('/api/persons', (request, response, next) => {
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

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Person.findByIdAndUpdate(request.params.id)
        .then(person => {
            if (!persons) {
                return response.status(404).end()
            }

            //person.name = name
            person.number = number

            return person
                .save()
                .then(updatedPerson => {
                    response.json(updatedPerson)
                })
        })
        .catch(error => next(error))
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