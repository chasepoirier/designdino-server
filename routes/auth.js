import express from 'express'
import User from '../models/User'
const router = express.Router();

/* GET home page. */
router.post("/", (req, res) => {
  const { credentials } = req.body;

  User.findOne({ email: credentials.email }).then(user => {
  	// console.log(user.isValidPassword(credentials.password));
  	if(!user) {
		res.status(400).json({ errors: { global: "Invalid Email" } });	
	} else {
		user.isValidPassword(credentials.password).then(password => {

			if (password) {
	      		res.json({ user: user.toAuthJSON() });
	    	} else {
	      		res.status(400).json({ errors: { global: "Invalid Passord" } });
	    	}
  		})
	}
  });
});


module.exports = router;
