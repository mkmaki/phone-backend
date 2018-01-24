const express = require('express')
const cors = require('cors')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())

const morgan = require('morgan')
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),    
    tokens.body(req, res),
    tokens.status(req, res),
  ].join(' ')
}))

let persons = [
  { name: 'Kalle', number: 0400, id: 1  },
  { name: 'Pekka', number: 0500, id: 2  },
  { name: 'Juho', number: 0600, id: 3  },
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  
  res.write('<h1>Phonebook has ' + persons.length + ' entries.</h1>')
  res.write(new Date().toString())
  res.send()
  
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  
  const person = persons.find(person => person.id === id )
  console.log(id, person)
  if(!person) {
    res.status(404).json({ error: 'Not found'})    
  }
  res.json(person)
})

app.post('/api/persons', (req, res) => {  
  console.log(req.body)
  const personObject = req.body
  if(!personObject.name || !personObject.number) {    
    return res.status(400).json({ error: 'Name or number is missing'}) // Remember to return here.
  }
  if(persons.find(person => person.number === personObject.number)) {
    return res.status(400).json({ error: 'Number is already on the phonebook'})
  }
  const newId = Math.random().toString(36).substr(2, 10) // Stackoverflow tip
  persons.push({ name: personObject.name, number: personObject.number, id: newId })
  res.status(201).json(personObject)
})



app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  
  const person = persons.find(person => person.id === id )
  console.log(id, person)
  persons = persons.filter(person => person.id !== id)
  if(!person) {
    res.status(404).json({ error: 'Not found'})    
  }
  res.status(204).end()
  //res.status(204).json(person)
})
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

