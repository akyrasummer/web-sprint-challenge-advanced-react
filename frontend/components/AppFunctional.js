import React, { useState, useEffect } from 'react'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

export default function AppFunctional(props) {
  const [index, setIndex] = useState(initialIndex)
  const [steps, setSteps] = useState (initialSteps)
  const [message, setMessage] = useState(initialMessage)
  const [email, setEmail] = useState(initialEmail)

  useEffect(() => {
    console.log(`Component mounted`)

    return () => {
      console.log(`Component unmounted`)
    }
  },
[])

useEffect (() => {
  console.log(`Index updated to ${index}. Coordinates: ${getXYMessage ()}`)
}, [index])

useEffect(() =>{
  console.log(`Steps updated to ${steps}`)
}, [steps])

  function getXY() {
    const x = index % 3
    const y = Math.floor(index / 3)
    return {x, y }
  }

  function getXYMessage() {
    const { x, y } = getXY()
    return `Coordinates (${x}, ${y})`
  }

  function reset() {
    setIndex(initialIndex)
    setSteps(initialSteps)
    setMessage(initialMessage)
  
  }

  function getNextIndex(direction) {
    const { x, y } = getXY()

    let newX = x
    let newY = y

    switch (direction) {
      case 'left':
        newX = Math.max(0, x - 1) // Ensure we don't go below 0
        break
      case 'right':
        newX = Math.min(2, x + 1) // Ensure we don't go above 2
        break
      case 'up':
        newY = Math.max(0, y - 1) // Ensure we don't go below 0
        break
      case 'down':
        newY = Math.min(2, y + 1) // Ensure we don't go above 2
        break
      default:
        break
    }
    const newIndex = newY * 3 + newX
    return newIndex
  }


  function move(evt) {
    const direction = evt.target.id
    
    const newIndex = getNextIndex(direction)

    if (newIndex !== index) {
      setIndex(newIndex)
      setSteps(steps + 1)
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value)
  }

  function onSubmit(evt) {
    evt.preventDefault()

    if (!email || !email.includes('a')) {
      setMessage(`Please enter a valid email`)
      return
    }
    
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        coordinates: getXY(),
        steps
      })
    })

    .then(response => response.json())
    .then(data => {
      console.log('Success', data)
      setMessage ('Form submitted successfully!')
    })
    .catch(error => {
      console.error('Error:', error)
    setMessage('Error submitting form')
    
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()})</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move} >RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input 
        id="email" 
        type="email" 
        placeholder="type email"
        value={email}
        onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
