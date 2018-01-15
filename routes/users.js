import express from "express";
import User from "../models/User";
import parseErrors from "../utils/parseErrors";
import { sendConfirmationEmail } from "../mailer";
import authenticate from "../middleware/authenticate";

const router = express.Router();

// Check tomorrow - something is causing site to crash on production //

router.post("/", (req, res) => {

  const { email, password, username } = req.body.user;
  const user = new User({ email, username });
  console.log('Attempt', user);

  user.setPassword(password);
  // user.setConfirmationToken();
  user
    .save()
    .then(userRecord => {
      // sendConfirmationEmail(userRecord);
      console.log('Success', userRecord);
      res.json({ user: userRecord.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

// router.post('/', (req, res) => {
//   res.json({user: {username: 'test'}})
// });

module.exports = router;
