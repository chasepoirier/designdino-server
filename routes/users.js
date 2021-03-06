import express from "express";
import User from "../models/User";
import parseErrors from "../utils/parseErrors";
import { sendConfirmationEmail } from "../mailer";
import authenticate from "../middleware/authenticate";
import shortid from 'shortid';
import fs from 'fs';
import path from "path";

import multerS3 from 'multer-s3'
import multer from 'multer';
import AWS from 'aws-sdk';

import config from '../config';
AWS.config = config;
const s3Bucket = new AWS.S3({ params: { Prefix: "avatars" } });

const router = express.Router();

const upload = multer({
    storage: multerS3({
        s3: s3Bucket,
        bucket: 'design-dino-uploads',
        key: function(req, file, cb) {
            let id = shortid.generate()
            cb(null, "avatars/" + id + "_" + file.originalname)
        }
    })
}).single('file');

router.post("/", (req, res) => {
    const { email, password, username, name } = req.body.user;
    const passwordHash = password;
    const user = new User({ name, email, username, passwordHash });

    user.setConfirmationToken();
    user.save().then(userRecord => {
            // sendConfirmationEmail(userRecord);
            res.json({ user: userRecord.toAuthJSON() });
        })
        .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/:id/update_user_info', (req, res) => {
    let id = req.params.id;
    User.findOneAndUpdate({ _id: id }, { $set: { title: req.body.title, bio: req.body.bio } }, { new: true})
        .select('bio title')
        .then(user => res.json({ title: user.title, bio: user.bio }));

});

router.get("/current_user", authenticate, (req, res) => {
    res.json({
        user: {
            email: req.currentUser.email,
            confirmed: req.currentUser.confirmed,
            username: req.currentUser.username,
            name: req.currentUser.name,
            avatar: req.currentUser.avatar,
            id: req.currentUser._id,
            likes: req.currentUser.likes,
            title: req.currentUser.title,
            bio: req.currentUser.bio
        }
    });
});

router.get('/:id/get_user_likes', (req, res) => {
    let _id = req.params.id;
    
    function compare(a, b) {
        if(a.likedAt < b.likedAt) return 1
        if(a.likedAt > b.likedAt) return -1
        return 0;
    }

    User.findOne({ _id }, 'likes -_id')
        .populate('likes.fossilId')
        .then(user => {
            // console.log(user.likes);
            user.likes.sort(compare) 
            res.json({ likes: user.likes})
        })

        // 
});

router.post('/:username/change_avatar', (req, res) => {

    const username = req.params.username;

    upload(req, res, function(err) {
        User.findOneAndUpdate({ username }, { $set: { avatar: req.file.key } }, { new: true }, (err, user) => {  
            res.json({ user: { avatar: user.avatar } })
        })
    });

});

module.exports = router;