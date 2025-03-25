const Hello = (props) => {
  console.log(props)
  return (
    <div>
      <p>Hello {props.name}, you are {props.age} years old</p>
    </div>
  )
}

const App = () => {
  const friends = [
    { name: 'Maya', age: 26 },
    { name: 'John', age: 30 },
    { name: 'Jane', age: 28 }
  ]
  return (
    <div>
      <p>{friends[0].name} {friends[0].age}</p>
      <p>{friends[2].name} {friends[2].age}</p>
    </div>
  )
}

export default App