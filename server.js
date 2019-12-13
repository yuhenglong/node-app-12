const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();

// 引入users.js
const users = require("./routes/api/users.js");

// DB config
const db = require("./config/keys").mongoURI;
// Connect to mongodb
mongoose.connect(db).then(() => {
    console.log('MongoDB Connected')
}).catch((err) => {
    console.log(err);
})

// 使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send('hello word');
});

// 使用routes
app.use("/api/users", users);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})