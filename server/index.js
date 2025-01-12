require('dotenv').config();
const cors = require('cors')
const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');
const userRoutes = require('./routes/user_routes');
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => console.log(error));
database.once('connected', () => console.log('Database connected'))

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes)
app.use('/api', routes)

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
})
