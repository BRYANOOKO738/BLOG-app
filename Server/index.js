const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const cookieparser=require("cookie-parser")
// const con = require('./db');
const userRoute = require('./routes/Auth');
const updateuserRoute = require('./routes/Updateuser');
const publishRoute=require('./routes/Createpost');
const verifyToken = require('./Verify.user');
const commentsRoute = require('./routes/Coment');
const SubscribeRoute = require('./routes/Subscribe');


const app = express();
port = 3000;
app.use(express.json());
app.use(cors())
app.use(cookieparser())

app.use('/routes/Auth', userRoute)
app.use('/routes/updateuser', updateuserRoute)
app.use('/routes/Publish', publishRoute)
app.use("/routes/comment", commentsRoute)
app.use("/routes/Subscribe", SubscribeRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})