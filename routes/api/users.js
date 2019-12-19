const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// 引入验证的方法
const validateRegisterInput = require("../../vallidation/register");
const validateLoginInput = require("../../vallidation/login");

router.get("/test", (req, res) => {
    res.json({ msg: "user message" });
})

router.post("/register", (req, res) => {
    // 验证输入
    const { errors, isValid } = validateRegisterInput(req.body);

    // 判断isvalid是否通过
    if (!isValid) {
        return res.status(400).json(errors)
    }
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

    // 验证输入
    const { errors, isValid } = validateLoginInput(req.body);

    // 判断isvalid是否通过
    if (!isValid) {
        return res.status(400).json(errors)
    }
    const email = req.body.email;
    const password = req.body.password;
    // 查询数据库
    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(404).json({ email: "用户不存在！" });
        }
        // 密码匹配
        bcrypt.compare(password, user.password, (err, isMatch) => {
            console.log(isMatch, user.password, password);
            if (!isMatch) {
                const rule = { id: user.id, name: user.name };
                jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                        if (err) throw err;
                        res.json({
                            success: true,
                            token: "Bearer " + token
                        })
                    })
                    // res.json({ msg: "success" })
            } else {
                return res.status(400).json({ password: "密码错误！" });
            }
        })
    })
})

//$route Get api/users/current
//@desc  return current user
//@access private
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;