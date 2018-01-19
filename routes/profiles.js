import express from "express";
import User from "../models/User";
import parseErrors from "../utils/parseErrors";
import { sendConfirmationEmail } from "../mailer";
import authenticate from "../middleware/authenticate";

const router = express.Router();


router.get("/get_profile/:username", authenticate, (req, res) => {
	let username = req.params.username;
  	User.findOne({ username }, '-passwordHash -confirmationToken').then(user => {
  		res.json({user})
  	})
});

module.exports = router;
