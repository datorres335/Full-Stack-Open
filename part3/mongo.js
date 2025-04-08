/*
    NOTE!!!!!!!!!
    THIS IS SAMPLE CODE FOR MONGODB USAGE, 
    refer to person.js for actual project implementation of mongoDB
*/
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://datorres335:${password}@cluster0.uiaciun.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false) // this is to avoid the deprecation warning for strictQuery
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema) // this creates a model called Person based on the personScheme, will show up as "people" in MongoDB Atlas (MongoDB pluralizes the model name)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log('phonebook:');        
        result.forEach(person => {
            //console.log(person)
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const person = new Person({
        name: `${process.argv[3]}`,
        number: `${process.argv[4]}`,
    })

    person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
    })
} else {
    console.log('Invalid number of arguments.')
}
/*
    NOTE!!!!!!!!!
    THIS IS SAMPLE CODE FOR MONGODB USAGE, 
    refer to person.js for actual project implementation of mongoDB
*/