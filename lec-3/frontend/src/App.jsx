import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [resturants,setResturants] = useState([]);
  useEffect(()=>{
    axios.get('/api/restaurants')
      .then((response)=>{
        setResturants(response.data)
      })
      .catch((error)=>{
        console.log(error);
        
      })
  },[])
  return (
    <>
       <h1>Hi this is me</h1>
       <h3>We have {resturants.length} resturants for you </h3>
       {
        resturants.map((resturant)=>(
           (<ul key={resturant.id}>name:{resturant.name},cuisine:{resturant.cuisine}</ul>)
        ))
       }
    </>
  )
}

export default App
