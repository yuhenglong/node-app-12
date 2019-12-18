const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require("../../models/User");

router.get("/test", (req, res) => {
    res.json({ msg: "user message" });
})

router.post("/register", (req, res) => {
    // console.log(req.body);
    // 查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email }).then((user) => {
        if (user) {
            return res.status(400).json({ email: "邮箱已被注册！" })
        } else {
            const avatar = gravatar.url(req.body.email, { s: "200", r: "pg", d: "mm" });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });
            newUser.save().then(user => { res.json(user) }).catch(err => console.log(err));
        }
    })
});

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: "用户不存在！" });
        }

    })
})
module.exports = router;