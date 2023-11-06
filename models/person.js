const mongoose = require('mongoose')
var env = require('dotenv').config();

mongoose.set('strictQuery', false)


const url = "mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb"


console.log('connecting to', url)

mongoose.connect(url, {
    auth: {
    username: process.env.COSMOSDB_USER,
    password: process.env.COSMOSDB_PASSWORD
  },
    retryWrites: false
})
.then(result => {
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