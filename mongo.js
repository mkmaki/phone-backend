const mongoose = require('mongoose')

const url = 'mongodb://YOURADDR'

mongoose.connect(url)
mongoose.Promise = global.Promise;

const Book = mongoose.model('Book', {
  name: String,
  number: String
})

const showAll = () => {
  Book
    .find({})
    .then(result => {
      console.log('Puhelinluettelo:')
      result.forEach(entry => {
        console.log(entry.name, entry.number)
    })
    mongoose.connection.close()
  })
}

const save = (name, number) => {
  new Book({
    name: name,
    number: number
  })
  .save()
  .then(response => {    
    mongoose.connection.close()
  })
}

if (process.argv.length === 4) {
  console.log(`Lisätään henkilö '${process.argv[2]}' numerolla '${process.argv[3]}' puhelinluetteloon.`);
  save(process.argv[2], process.argv[3])
} else if (process.argv.length === 2) {
  showAll()
} else {
  console.log('wrong number of arguments')
  process.exit()
}
