const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
// const con = require('./db');
const userRoute = require('./routes/Auth');


const app = express();
port = 3000;
app.use(express.json());
app.use(cors())

app.use('/routes/Auth', userRoute)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})