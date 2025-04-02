import { useState, useEffect } from 'react'
import axios from 'axios'

const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY
//console.log('API Key:', apiKey)

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY

  useEffect(() => {
    if (country) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${apiKey}&units=metric`
      
      axios
        .get(url)
        .then(response => {
          setWeather(response.data);
          console.log(response.data);
          
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [country, apiKey])

  if (!weather) {
    return
  }

  return (
    <div>
      <h2>Weather in {country}</h2>
      <div>Temperature: {weather.main.temp}°C</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
  )
}

const FindCountriesInput = ({ userInput, handleCountryChange }) => {
  return (
    <div>
      find countries <input value={userInput} onChange={handleCountryChange} />
    </div>
  )
}

const ShowButton = ({ countryName }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [countryDetails, setCountryDetails] = useState(null)

  const handleClick = () => {
    if (!showDetails) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
        .then(response => {
          const data = response.data
          setCountryDetails({
            name: data.name.common,
            capital: data.capital,
            area: data.area,
            languages: Object.values(data.languages),
            flag: data.flags.png,
          })
          setShowDetails(true)
        })
        .catch(error => {
          console.error('Error fetching country details:', error)
        })
    } else {
      setShowDetails(false)
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {showDetails ? 'hide' : 'show'}
      </button>
      {showDetails && countryDetails && (
        <div>
          <h2>{countryDetails.name}</h2>
          <div>Capital {countryDetails.capital}</div>
          <div>Area {countryDetails.area}</div>
          <h2>Languages</h2>
          <ul>
            {countryDetails.languages.map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          <img src={countryDetails.flag} alt={`Flag of ${countryDetails.name}`} />
          <Weather country={countryDetails.name} />
        </div>
      )}
    </>
  )
}

const DisplayResults = ({ filteredResults }) => {
  const [countryDetails, setCountryDetails] = useState(null)

  useEffect(() => {
    if (filteredResults) {
      if (filteredResults.length === 1) {
        const countryName = filteredResults[0]
        axios
          .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countryName}`)
          .then(response => {
            const data = response.data
            setCountryDetails({
              name: data.name.common,
              capital: data.capital,
              area: data.area,
              languages: Object.values(data.languages), // Convert languages object to an array
              flag: data.flags.png,
            })
          })
          .catch(error => {
            console.error('Error fetching country details:', error)
          })
      } else {
        setCountryDetails(null)
      }
    }
    
  }, [filteredResults])

  if (!filteredResults) {
    return null
  }

  if (filteredResults.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (filteredResults.length === 1 && countryDetails) {
    return (
      <div>
        <h2>{countryDetails.name}</h2>
        <div>Capital {countryDetails.capital}</div>
        <div>Area {countryDetails.area}</div>
        <h2>Languages</h2>
        <ul>
          {countryDetails.languages.map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={countryDetails.flag} alt={`Flag of ${countryDetails.name}`} />
        <Weather country={countryDetails.name} />
      </div>
    )
  }

  return (
    <>
      {filteredResults.map(country => (
        <div key={country}>
          {country}{' '}
          <ShowButton countryName={country}/>
        </div>
      ))}
    </>
  )
}

const App = () => {
  const [allCountries, setAllCountries] = useState(null)
  const [userInput, setUserInput] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        const countryNames = response.data.map(country => country.name.common)
        setAllCountries(countryNames)
      })
  }, [])
  //console.log( 'All countries fetched:', allCountries)

  const handleCountryChange = event => {
    const inputValue = event.target.value
    console.log(inputValue)

    setUserInput(inputValue)
  }

  const filteredResults = userInput
    ? allCountries.filter(country =>
        country.toLowerCase().includes(userInput.toLowerCase())
      )
    : null
  //console.log(filteredResults)

  return (
    <div>
      <FindCountriesInput
        country={userInput}
        handleCountryChange={handleCountryChange}
      />
      <DisplayResults filteredResults={filteredResults} />
    </div>
  )
}

export default App
