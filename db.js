const mongoose = require('mongoose')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise
const Schema = mongoose.Schema

const bookSchema = new Schema({ name: String, number: String, id: String })
bookSchema.statics.format = function (content, cb) {
  return {
    name: content.name,
    number: content.number,
    id: content.id
  }
}
const Book = mongoose.model('Book', bookSchema)

const showAll = () => {
  const request = Book.find({})
  return request.then(data => data.map(Book.format))
}

const count = () => {
  return Book.count({})
}

const showOneById = (id) => {
  const request = Book.findOne({ id: id })
  return request.then(data => Book.format(data))
}

const showOneByName = (name) => {
  return Book.findOne({ name: name })
}

const save = (obj) => {
  return new Book({
    name: obj.name,
    number: obj.number,
    id: obj.id
  })
    .save()
}

const replace = (id, number) => {
  return Book.findOneAndUpdate({ id: id }, { number: number })
}

const remove = (id) => {
  return Book.findOneAndRemove({ id: id })
}

module.exports = {
  showAll: showAll,
  save: save,
  replace: replace,
  remove: remove,
  showOneById: showOneById,
  count: count,
  showOneByName: showOneByName
}
