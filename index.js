const express = require('express')
const app = express()
const morgan = require("morgan")
const cors = require('cors')
let phonebook = require('./phonebook')

const PORT = process.env.PORT || 3001

// To access the data easily, we need the help of the express json-parser 
/*
The json-parser functions so that it takes 
the JSON data of a request,
transforms it into a JavaScript object 
and then attaches it to the body property 
of the request object before 
the route handler is called.
*/

// morgan logs changes to the application

// cors allows same orgin policy

app.use(express.static('dist'))

app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

const watch = morgan(':method :url :status :res[content-length] - :response-time ms :body')

app.use(watch)

app.use(cors())

//GET ALL PERSONS
app.get('/api/persons', (req, res) => {
    res.send(phonebook)
})

//GET ONE PERSON
app.get('/api/persons/:id', (req, res) => {

    const id = parseInt(req.params.id);
    const foundPerson = phonebook.find(person => person.id == id)

    if (foundPerson) {
        res.send(foundPerson)
    } else {
        res.status(404).end()
    }
})

// CREATE A NEW RESSOURCE
// Adding a note happens by making an HTTP POST request to the address
//and by sending all the information for the new note in the request body in JSON format.
//GENERATE ID
function generateId() {
    return Math.floor(Math.random() * 199)
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return res.status(400).json({
            error: 'number is missing'
        })
    }

    const foundName = phonebook.find(person => person.name == body.name)

    if (foundName) {
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    // phonebook = [...phonebook, newPerson]
    phonebook = phonebook.concat(newPerson)
    // console.log(phonebook);
    res.json(newPerson)
})

// DELETE A RESSOURCE BY ID
app.delete('/api/persons/:id', (req, res) => {
    const id = parseInt(req.params.id);
    phonebook = phonebook.filter(person => person.id != id)
    res.status(204).end()
})

//info
app.get("/info", (req, res) => {
    const entries = phonebook.length
    const message = `<p> Phonebook has info for ${entries} people </p>`
    const date = new Date()
    res.send(message + date)
})


app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}...`);
})

