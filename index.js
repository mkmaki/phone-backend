const express = require('express')
const cors = require('cors')
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

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
  { name: 'Kalle', number: "040 123", id: 'p4zeecpz4c'  },
  { name: 'Pekka', number: "040 456", id: 'k4zeecpz4c'  },
  { name: 'Juho', number: "040 589", id: 'r4zeecpz4c'  },
]

//app.get('/', (req, res) => {
//  res.send('<h1>Hello World!</h1>')
//})

app.get('/info', (req, res) => {  
  res.write('<h1>Phonebook has ' + persons.length + ' entries.</h1>')
  res.write(new Date().toString())
  res.send()
  
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = (req.params.id)  
  const person = persons.find(person => person.id === id )  
  
  if(!person) {
    res.status(404).json({ error: 'Not found'})    
  }
  res.json(person)
})

app.post('/api/persons', (req, res) => {    
  if(!req.body.name || !req.body.number) {    
    return res.status(400).json({ error: 'Name or number is missing'}) // Remember to return here.
  }
  if(persons.find(person => person.number === req.body.number)) {
    return res.status(400).json({ error: 'Number is already on the phonebook'})
  }  
  newObject = {}
  newObject.id = Math.random().toString(36).substr(2, 10) // Stackoverflow tip
  newObject.name = req.body.name
  newObject.number = req.body.number
  persons.push(newObject)
  res.status(201).json(newObject)
})

app.put('/api/persons/:id', (req, res) => {  
  const id = (req.params.id)
  const person = persons.find(person => person.id === id )
  person.number = req.body.number  
  res.status(200).end()
})


app.delete('/api/persons/:id', (req, res) => {
  const id = (req.params.id)  
  const person = persons.find(person => person.id === id )  
  persons = persons.filter(person => person.id !== id)
  if(!person) {
    res.status(404).json({ error: 'Not found'})    
  }
  res.status(204).end()  
})


const error = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(error) 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

