const mongoose = require('mongoose')
require('dotenv').config()

mongoose.set('strictQuery', false)


const url = 'mongodb://'+process.env.COSMOSDB_HOST+':'+process.env.COSMOSDB_PORT+'/'+process.env.COSMOSDB_DBNAME+'?ssl=true&replicaSet=globaldb'


console.log('connecting to', url)

mongoose.connect(url, {
  auth: {
    username: process.env.COSMOSDB_USER,
    password: process.env.COSMOSDB_PASSWORD
  },
  retryWrites: false
})
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: v => (/\d{3}-\d{8}/.test(v)),
      message: ({ value }) => `${value} is not a valid phone number.`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model('Person', personSchema)