import express from "express";
import Fossil from "../models/Fossil";
import parseErrors from "../utils/parseErrors";

import authenticate from "../middleware/authenticate";

import shortid from 'shortid';
import fs from 'fs';
import path from "path";

import multerS3 from 'multer-s3'
import multer from 'multer';
import AWS from 'aws-sdk';

AWS.config.loadFromPath('./config.json');
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

router.post('/:id/new_fossil', (req, res) => {
    
    upload(req, res, function(err) {

        let tags = req.body.tags.split(",")
        let url = req.body.title.replace(/\s+/g, "-")

        let newFossil = new Fossil({
            headerImage: req.file.key,
            title: req.body.title,
            tags: tags,
            author: req.params.id,
            url: shortid.generate() + "-" + url,
            desc: req.body.desc
        });

        newFossil.save().then(fossil => {
            res.json({ url: fossil.url})
        });
    });
});

router.get('/:id', (req, res) => {
  let url = req.params.id;

  Fossil.findOne({ url })
      .populate('author', 'name email avatar username')
      .then(fossil => res.json({ fossil }))
});

router.get('/query/user/:id', (req, res) => {
    let user = req.params.id;



    Fossil.find({ author: user })
        .populate('author', 'name avatar username')
        .then(fossils => {
            res.json({ fossils })
        })
});

router.get('/query/get_all', (req, res) => {

    Fossil.find({})
        .populate('author', 'name avatar username')
        .then(fossils => {
            res.json({ fossils })
        })
});

module.exports = router;
