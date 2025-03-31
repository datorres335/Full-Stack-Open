import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = ({ filteredResults }) => {
  return (
    <>
      <ul>
        {filteredResults.map(person => (
          <Person key={person.name} name={person.name} number={person.number} />
        ))}
      </ul>
    </>
  )
}

const Person = ({name, number}) => {
  return (
    <li>{name} {number}</li>
  )
}

const Filter = ({newFilter, handleFilterChange}) => {
  return (
    <>
      <div>filter shown with <input value={newFilter} onChange={handleFilterChange}/></div>
    </>
  )
}

const PersonForm = ({addNameNumber, newName, handleNameChange, newNumber, handleNumberChange}) => {
  <form onSubmit={addNameNumber}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    console.log('Effect activated')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('Promise fulfilled')
        setPersons(response.data)
        //console.log(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    const inputFilter = event.target.value   
    setNewFilter(inputFilter.trim())
    const test = newFilter
    console.log(test); 
  }

  const filteredResults = (newFilter === '') 
    ? persons 
    : persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()) || person.number.includes(newFilter))

  const addNameNumber = (event) => {
    event.preventDefault()
    if (newName.trim() === '' || newNumber.trim() === ''){
      alert(`Please enter a name and number`)
      setNewName('')
      setNewNumber('')
      return
    }

    const inputName = newName.trim()
    const inputNumber = newNumber.trim()
    if (persons.some(person => person.name === inputName || person.number === inputNumber)){
      alert(`${newName} or ${newNumber} is already on the phonebook`)
      //setNewName('')
    }
    else {
      const nameObject = {
        name: newName,
        number: newNumber
      }
      
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
    }
  }

  const handleNameChange = (event) => {
    const inputName = event.target.value
    console.log(inputName);
    setNewName(inputName);
  }

  const handleNumberChange = (event) => {
    const inputNumber = event.target.value
    console.log(inputNumber);
    setNewNumber(inputNumber);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange}/>

      <h3>add a new</h3>
      <PersonForm 
        addNameNumber={addNameNumber} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />
      <h3>Numbers</h3>
      <Persons filteredResults={filteredResults}/>
    </div>
  )
}

export default App