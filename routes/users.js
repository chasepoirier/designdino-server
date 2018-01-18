import express from "express";
import User from "../models/User";
import parseErrors from "../utils/parseErrors";
import { sendConfirmationEmail } from "../mailer";
import authenticate from "../middleware/authenticate";
import multer from 'multer';
import shortid from 'shortid';
import fs from 'fs';
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename(req, file, cb) {
    cb(null, `${shortid.generate()}-${file.originalname}`)
  },
})

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
      name: req.currentUser.name
    }
  });
});

const upload = multer({ storage })

router.post('/:username/change_avatar', upload.single('file'), (req, res) => {

  const file = req.file;
  const username = req.params.username;
    
  User.findOne({ username }, 'avatar', (err, user) => {
    console.log(user.avatar);

    if(user.avatar !== null) {
      const basePath = path.join(__dirname, '../uploads')
      fs.unlink(`${basePath}/${user.avatar}`, err => {
        if(err) console.log(err)
      })
    }

    user.avatar = file.filename;
    user.save()
    res.json({user: { avatar: user.avatar }})  
  })
});

module.exports = router;
