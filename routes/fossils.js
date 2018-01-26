import express from "express";
import parseErrors from "../utils/parseErrors";

import Fossil from "../models/Fossil";
import User from '../models/User';

import authenticate from "../middleware/authenticate";

import shortid from 'shortid';
import fs from 'fs';
import path from "path";

import multerS3 from 'multer-s3'
import multer from 'multer';
import AWS from 'aws-sdk';

import config from '../config';

AWS.config = config;
const s3Bucket = new AWS.S3();

const router = express.Router();

const upload = multer({
    storage: multerS3({
        s3: s3Bucket,
        bucket: 'design-dino-uploads',
        key: function(req, file, cb) {
            let id = shortid.generate()
            cb(null, "fossils/" + id + "_" + file.originalname)
        }
    })
}).single('file');

router.post('/:id/new_fossil', authenticate, (req, res) => {
    
    upload(req, res, function(err) {

        let tags = req.body.tags.split(",")
        let url = req.body.title.replace(/\s+/g, "-")

        let newFossil = new Fossil({
            headerImage: req.file.key,
            title: req.body.title,
            tags: tags,
            author: req.params.id,
            url:  url + "-" + shortid.generate(),
            desc: req.body.desc
        });

        newFossil.save().then(fossil => {
            res.json({ url: fossil.url})
        });
    });
});

router.post('/clap_up/:id', (req, res) => {
    let id = req.params.id;
    let like = {
        count: req.body.userClaps.count,
        fossilId: id,
        index: req.body.userClaps.index,
        likedAt: Date.now()
    }

    Fossil.findOneAndUpdate({ _id: id }, { $set: { dinoClaps: req.body.fossilClaps.count } }, { new: true }).then(fossil => {
        User.findOne({ _id: req.body.userClaps.id })
            .then(user => {

                let pos = user.likes.map(like => {
                    return like.fossilId.toString()
                }).indexOf(fossil.id)
                
                if(pos !== -1) {
                    user.likes[pos] = like
                } else {
                    user.likes.push(like)
                }
                return user;
            })
            .then(user => {
                user.save()
                res.json({ claps: { fossil: fossil.dinoClaps, user: { like } } })
            })
    })

    // fossil => res.json({ claps: fossil.dinoClaps })

});

router.get('/:id', authenticate, (req, res) => {
  let url = req.params.id;

  Fossil.findOne({ url })
      .populate('author', 'name title avatar username')
      .then(fossil => res.json({ fossil }))
});

router.get('/query/user/:id', (req, res) => {
    let user = req.params.id;

    Fossil.find({ author: user })
        .populate('author', 'name avatar username')
        .sort({ createdAt: -1 })
        .then(fossils => {
            res.json({ fossils })
        })
});

router.get('/query/get_all', (req, res) => {
    Fossil.find({})
        .populate('author', 'name avatar username')
        .sort({ dinoClaps: -1 })
        .then(fossils => {
            res.json({ fossils })
        })
});

module.exports = router;
