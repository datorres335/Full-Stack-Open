const express = require('express')
const app = express()
app.use(express.json()) //used to convert json data into a javascript object, used in post requests

let morgan = require('morgan')
app.use(morgan('tiny')) //tiny is a predefined format in morgan, it will log the request method, url, and response status code

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

app.get('/info', (request, response) => {
    const date = new Date()
    const numOfPeople = `Phonebook has info for ${persons.length} people`
    response.send(
        `<p>${numOfPeople}<p/>
        <p>${date}</p>`
    )
    //response.send('<h1>Whats up world?</h1>')
})

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

//this allows users to get the info of a specific person by their id
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generatedId = () => {
    const maxId = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 6 + 1)) + 6;

    return String(maxId + 1)
}

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

    const person = {
        id: generatedId(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint) //this is a middleware function that will handle requests to unknown endpoints, must be placed after all the other route handlers