import { useState } from 'react'

const Header = ({course}) => {
  console.log('Log from the Header component:', course)
  return (
    <h1>{course}</h1>
  )
}

const Part = ({part, exercises}) => {
  console.log('Log from the Part component:', part, exercises)
  return (
    <p>
      {part} {exercises}
    </p>
  )
}

const Content = ({parts}) => {
  console.log('Log from the Content component:', parts)
  return (
    <div>
      <Part part={parts[0].name} exercises={parts[0].exercises} />
      <Part part={parts[1].name} exercises={parts[1].exercises} />
      <Part part={parts[2].name} exercises={parts[2].exercises} />
    </div>
  )
}

const Total = ({parts}) => {
  console.log('Log from the Total component', parts)
  return (
    <p>Number of exercises {parts[0].exercises + parts[1].exercises + parts[2].exercises}</p>
  )
}

const App = () => {
  const [counter, setCounter] = useState(0) //useState is a hook that allows you to add state to a functional component. It returns an array with two elements: the current state and a function to update it.

  setTimeout(() => setCounter(counter +1), 1000) //setTimeout is a function that takes a function and a time in milliseconds as arguments. It will call the function after the specified time has passed.

  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts}/>
      <Total parts={course.parts} />
    </div>
  )
}

export default App
