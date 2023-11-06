const mongoose = require('mongoose')
var env = require('dotenv').config();

if (process.argv.length<3) {
    console.log('Usage: node mongo.js <password> <name> <number>')
    process.exit(1)
  }
  
const password = process.argv[2]

mongoose.set('strictQuery',false)
mongoose.connect("mongodb://"+process.env.COSMOSDB_HOST+":"+process.env.COSMOSDB_PORT+"/"+process.env.COSMOSDB_DBNAME+"?ssl=true&replicaSet=globaldb", {
    auth: {
    username: process.env.COSMOSDB_USER,
    password: password
  },
    retryWrites: false
})
.then(() => {
    console.log('Connection to CosmosDB successful')
        const personSchema = new mongoose.Schema({
            name: String,
            number: String,
        })
        
        const Person = mongoose.model('Person', personSchema)

        if (process.argv.length == 3) {
            Person.find({})
            .then(result => {
                result.forEach(person => {
                    console.log(person)
                    mongoose.connection.close()
                })
            })
        } else {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            })
            
            person.save()
                .then(result => {
                    console.log('person saved!')
                    mongoose.connection.close()
                })
                .catch(error => {
                    console.log(error)
            })
        }
})
.catch((err) => console.error(err));

