const express = require('express')
const { connection } = require('./db/connection')
const authRoutes = require('./routes/userRouter')
const core = require("cors")
const productRouter = require('./routes/productRouter')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use(core())

app.use('/auth', authRoutes);
app.use('/product', productRouter);

app.get('/', (req,res) => res.send('hello'))

let PORT = 8080

app.listen(PORT, async() => {
    await connection
console.log(`Server started on http://localhost:${PORT}`)})