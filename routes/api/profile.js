const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profiles");
const User = require("../../models/User");

// $route GET api/profile/test
// @desc 返回请求的sjon数据
// @acces public
router.get("/test", (req, res) => {
    res.json({ msg: "profile works" })
});

// $route GET api/profile
// @desc 获取当前登录用户的个人信息
// @acces private
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
    const errors = {}
    Profile.findOne({ user: req.user.id }).then((profile) => {
        if (!profile) {
            errors.noprofile = "该用户信息不存在！";
            return res.status(404).json(errors);
        }
        res.json(profile);

    }).catch(error => {
        res.status(404).json(error);
    })
});
module.exports = router;