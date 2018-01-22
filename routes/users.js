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

AWS.config.loadFromPath('./config.json');
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

router.get("/current_user", authenticate, (req, res) => {
    res.json({
        user: {
            email: req.currentUser.email,
            confirmed: req.currentUser.confirmed,
            username: req.currentUser.username,
            name: req.currentUser.name,
            avatar: req.currentUser.avatar,
            id: req.currentUser._id,
            likes: req.currentUser.likes
        }
    });
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