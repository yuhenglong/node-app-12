const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

// 引入users.js
const users = require("./routes/api/users.js");
const profile = require("./routes/api/profile.js");

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

// 使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})

//passport 初始化
app.use(passport.initialize());
require("./config/passport")(passport);

// app.get("/", (req, res) => {
//     res.send('hello word');
// });

// 使用routes
// 访问/api/users，则会找到users里面的东西
app.use("/api/users", users);
app.use("/api/profile", profile);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})