import { useEffect, useState } from 'react'
import './App.css'
import PropsTypes from "prop-types"
import searchicon from "./assets/search.png";
import clearicon from "./assets/clear.png";
import cloudicon from "./assets/cloud.png";
import dizzleicon from "./assets/dizzle.png";
import humidityicon from "./assets/humidity.png";
import rainicon from "./assets/rain.png";
import snowicon from "./assets/snow.png";
import  windicon from "./assets/wind.png";

const WheatherDetails=({icon,temp,city,country,lat,log,humidity,wind})=>{
  return(
    <>
    <div className="image">
      <img src={icon} alt="Image" width="130px" height="130px"/>
    </div>
    <div className="temp">{temp}°C</div>
    <div className="city">{city}</div>
    <div className="country">{country}</div>
    <div className="cord">
      <div> 
        <span className="lat">Latitude</span> 
      <span> {lat}</span>
      </div>

      <div>
      <span className="lat">Longtitude</span>
      <span>{log}</span>
      </div>

    </div>

    <div className="data-container">
      <div className="element">
        <img src={humidityicon} alt="humidity" width="50px" height="50px" />
        <div className="humidity-per">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>

      <div className="element">
        <img src={windicon} alt="wind" width="50px" height="50px" />
        <div className="wind-per">{wind}h/km</div>
        <div className="text">Wind</div>
      </div>
    </div>
    </>
  );
}

WheatherDetails.protoType={
  icon:PropsTypes.string.isRequired,
  temp:PropsTypes.number.isRequired,
  city:PropsTypes.string.isRequired,
  country:PropsTypes.string.isRequired,
  humidity:PropsTypes.number.isRequired,
  wind:PropsTypes.number.isRequired,
  lat:PropsTypes.number.isRequired,
  log:PropsTypes.number.isRequired,
}

function App() {
  let api_key=`444f65254152c50afbf6116757356619`;
  const [text,setText]=useState("Thoothukudi");
  const [icon,setIcon]=useState(snowicon);
  const [temp,setTemp]=useState(0);
  const [city,setCity]=useState("");
  const [country,setCountry]=useState("");
  const [lat,setLat]=useState(0);
  const [log,setLog]=useState(0);
  const [humidity,setHumidity]=useState(0);
  const [wind,setWind]=useState(0);
  const [dataNotFound,setDataNotFound]=useState(false);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const weatherIconMap={
    "01d":clearicon,
    "01n":clearicon,
    "02d":cloudicon,
    "02n":cloudicon,
    "03d":dizzleicon,
    "03n":dizzleicon,
    "04d":dizzleicon,
    "04n":dizzleicon,
    "09d":rainicon,
    "09n":rainicon,
    "010d":rainicon,
    "010n":rainicon,
    "013d":rainicon,
    "013n":rainicon,

  }

  const search=async()=>{
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
  
    try {
      let  res=await fetch(url)
      let data= await res.json()
      if(data.cod==="404"){
        console.error("City Not Found")
        setDataNotFound(true)
        setLoading(false)
        return;
      }
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)

      const weatherIcon=data.weather[0].icon
      setIcon(weatherIconMap[weatherIcon] || clearicon )
      setDataNotFound(false)
      
    } catch (error) {
      console.error("An Error Occured: ",error.message)
    setError("An error occurred while fetching weather data")
    }
    finally{
      setLoading(false)
    }
  }
  const handleClick=(e)=>{
    setText(e.target.value)
  }

  const handlekeydown=(e)=>{
    if(e.key==="Enter"){
      search()
    }
  }

  useEffect(function(){
    search()
  },[])
  return (
    <>
    <div className='container'>
    <div className='input-container'>
        <input type="text" className='cityInput'  placeholder='Search City'
        onChange={handleClick} value={text}
        onKeyDown={handlekeydown}/>
        <div className="search-icon" onClick={()=>search()}>
          <img src={searchicon} alt="Search" width="30px" height="30px" />
        </div>
      </div>

     { loading &&<div className="loading-message">loading..</div>}
      {error &&<div className="error-message">{error}</div>}
     { dataNotFound && <div className="city-not-found">City Not found</div>}

     {!loading && !dataNotFound && <WheatherDetails icon={icon} temp={temp} 
      city={city} country={country} lat={lat} log={log} 
      humidity={humidity} wind={wind}/>}
    </div>
    </>
  )
}

export default App
