import { useState, useEffect } from 'react'
import personService from './services/persons'

const Persons = ({ filteredResults, setPersons, setPopUpMessage }) => {
  return (
    <ul>
      {filteredResults.map(person => (
        <Person key={person.id} id={person.id} name={person.name} number={person.number} setPersons={setPersons} setPopUpMessage={setPopUpMessage}/> 
      ))}
    </ul>
  )
}

const DeletePerson = ({ id, name, setPersons, setPopUpMessage }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .remove(id)
      .then(() => {
        setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
      })
      .catch(error => {
        setPopUpMessage(`Information of ${name} has already been removed from server`)
        setTimeout(() => {
          setPopUpMessage(null)
        }, 5000)
        setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
      })
    }
  }

  return (
    <button onClick={handleDelete}>delete</button>
  )
}

const Person = ({ id, name, number, setPersons, setPopUpMessage }) => {
  return (
    <li>
      {name} {number} <DeletePerson id={id} name={name} setPersons={setPersons} setPopUpMessage={setPopUpMessage} />
    </li>
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
  return (
    <form onSubmit={addNameNumber}>
      <div>name: <input value={newName} onChange={handleNameChange}/></div>
      <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
}

const Notification = ({message}) => {
  const error = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    display: 'inline-block'
  }

  if (message === null) {
    return null
  }

  return (
    <div style={error}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [popUpMessage, setPopUpMessage] = useState(null)

  useEffect(() => {
    //console.log('Effect activated')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
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
    if (persons.some(person => person.name === inputName && person.number !== inputNumber)){
      if (window.confirm(`${inputName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === inputName)
        const changedPhoneNumber = {...personToUpdate, number: inputNumber}

        personService
        .update(personToUpdate.id, changedPhoneNumber)
        .then(() => {
          setPersons(prevPersons =>
            prevPersons.map(person => person.id !== personToUpdate.id ? person : changedPhoneNumber)
          )
        })
        .then(() => {
          setNewName('')
          setNewNumber('')
          setPopUpMessage(`Updated ${inputName}'s number successfully`)
          setTimeout(() => {
            setPopUpMessage(null)
          }, 5000)
        })
        .catch(error => {
          setPopUpMessage(`Information of ${inputName} has already been removed from server`)
          setTimeout(() => {
            setPopUpMessage(null)
          }, 5000)
          setPersons(prevPersons => prevPersons.filter(person => person.id !== personToUpdate.id))
        })
      }
    }
    else {
      const nameObject = {
        name: newName,
        number: newNumber
      }

      personService
        .create(nameObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setPopUpMessage(`Added ${returnedPerson.name} successfully`)
          setTimeout(() => {
            setPopUpMessage(null)
          }, 5000)
        })      
    }
  }

  const handleNameChange = (event) => {
    const inputName = event.target.value
    //console.log(inputName);
    setNewName(inputName);
  }

  const handleNumberChange = (event) => {
    const inputNumber = event.target.value
    //console.log(inputNumber);
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
      <Notification message={popUpMessage} />
      <h3>Numbers</h3>
      <Persons filteredResults={filteredResults} setPersons={setPersons} setPopUpMessage={setPopUpMessage}/>
    </div>
  )
}

export default App