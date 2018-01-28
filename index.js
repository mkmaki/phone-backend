const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./db')
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

//app.get('/', (req, res) => {
//  res.send('<h1>Hello World!</h1>')
//})

app.get('/info', (req, res) => {
  db.count()
    .then(result => {
      res.write('<h1>Phonebook has ' + result + ' entries.</h1>')
      res.write(new Date().toString())
      res.send()
    })
})

app.get('/api/persons', (req, res) => {
  db.showAll()
    .then(data => {
      res.json(data)
    })
})

app.get('/api/persons/:id', (req, res) => {
  const id = String(req.params.id)

  db.showOneById(id)
    .then(data => {
      res.json(data)
    })
    .catch(() => {
      res.status(404).json({ error: 'Not found' })
    })
})

app.post('/api/persons', (req, res) => {
  if(!req.body.name || !req.body.number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }
  db.showOneByName(req.body.name)
    .then(result => {
      if(result === null) {
        const newObject = {}
        newObject.name = req.body.name
        newObject.number = req.body.number
        newObject.id = Math.random().toString(36).substr(2, 10) // Stackoverflow tip
        db.save(newObject)
          .then(() => {
            res.status(201).json(newObject)
          })
      } else {
        return res.status(400).json({ error: 'Name is already on the phonebook.' })
      }
    })
    .catch(() => {
      return res.status(400).json({ error: 'Something failed' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const id = String(req.params.id)
  db.replace(id, req.body.number)
    .catch(error => {
      console.log(error)
    })
  res.status(200).end()
})

app.delete('/api/persons/:id', (req, res) => {
  const id = String(req.params.id)
  db.remove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(() => {
      res.status(404).json({ error: 'Not found' })
    })
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

