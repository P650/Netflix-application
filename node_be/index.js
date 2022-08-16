require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const session = require('express-session')
const cors = require('cors')


try {
    mongoose.connect(process.env.DB_URL, {
        authSource: "netflix",
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log('DB Connected!')
} catch (error) {
    console.log("Error in DB: ", error.message)
}


const ratingRouter = require('./routes/rating')
const movieDefRouter = require('./routes/movie')

const app = express()
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5005'
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: (process.env.SESSION_SECURE === 'true') ? true : false,
        httpOnly: true
    }
}))

app.use(morgan('dev'))
app.use(express.json())


app.use('/rating', ratingRouter)
app.use('/movie', movieDefRouter)


const PORT = 4999
app.listen(PORT, () => {
    console.log('Server running on http://127.0.0.1:' + PORT)
})