const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieparser=require("cookie-parser")
// const con = require('./db');
const userRoute = require('./routes/Auth');
const updateuserRoute = require('./routes/Updateuser');




const app = express();
port = 3000;
app.use(express.json());
app.use(cors())
app.use(cookieparser())

app.use('/routes/Auth', userRoute)
app.use('/routes/updateuser', updateuserRoute)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})