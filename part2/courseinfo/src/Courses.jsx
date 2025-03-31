const Courses = (props) => {
    return (
      <div>
        {props.courses.map(course => (
          <Course key={course.id} course={course} />
        ))}
      </div>
    )
  }
  
  const Course = (props) => {
    const total = props.course.parts.reduce((sum, part) => (sum + part.exercises), 0)
    console.log(total);
    
    return (
      <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts} />
        <Total total={total}/>
      </div>
    )
  }
  
  const Header = (props) => <h2>{props.course}</h2>
  
  const Content = (props) => (
    <div>
      {props.parts.map(part => (<Part key={part.id} part={part} />))}
    </div>
  )
  
  const Part = (props) => (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
  
  const Total = (props) => <strong>Number of exercises {props.total}</strong>

  export default Courses