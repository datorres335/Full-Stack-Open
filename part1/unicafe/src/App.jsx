import {useState} from 'react'

const Button = ({handleClick, value}) => {
  return (
    <button onClick={handleClick}>{value}</button>
  )
}

const StatisticLine = ({text, value}) => {
  if (text === 'positive') {
    return (
      <tr>
        <td>{text}</td>
        <td>{value}%</td>
      </tr>
    )
  }
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad, all, average, positive}) => {
  if (all === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <div>
       <table>
        <tbody>
          <StatisticLine text="good" value={good}/>
          <StatisticLine text="neutral" value={neutral}/>
          <StatisticLine text="bad" value={bad}/>
          <StatisticLine text="all" value={all}/>
          <StatisticLine text="average" value={average}/>
          <StatisticLine text="positive" value={positive}/>
        </tbody>
       </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGood = () => {
    const newGoodScore = good + 1
    setGood(newGoodScore)
    //handleAllAveragePositive()
    const sum = newGoodScore + neutral + bad
    setAll(sum)

    const averageScore = (newGoodScore - bad) / sum
    setAverage(averageScore)

    const positivePercentage = (newGoodScore / sum) * 100
    setPositive(positivePercentage)
  }
  const handleNeutral = () => {
    const newNeutralScore = neutral + 1
    setNeutral(newNeutralScore)
    //handleAllAveragePositive()
    const sum = good + newNeutralScore + bad
    setAll(sum)

    const averageScore = (good - bad) / sum
    setAverage(averageScore)

    const positivePercentage = (good / sum) * 100
    setPositive(positivePercentage)
  }
  const handleBad = () => {
    const newBadcore = bad + 1
    setBad(newBadcore)
    //handleAllAveragePositive()
    const sum = good + neutral + newBadcore
    setAll(sum)

    const averageScore = (good - newBadcore) / sum
    setAverage(averageScore)

    const positivePercentage = (good / sum) * 100
    setPositive(positivePercentage)
  }

  return (
    <div>
       <h1>give feedback</h1>
       <Button handleClick={handleGood} value="good"/>
       <Button handleClick={handleNeutral} value="neutral"/>
       <Button handleClick={handleBad} value="bad"/>

       <h1>statistics</h1>
       <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positive={positive}/>
    </div>
  )
}

export default App