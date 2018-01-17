import express from "express";
import User from "../models/User";
import parseErrors from "../utils/parseErrors";
import { sendConfirmationEmail } from "../mailer";
import authenticate from "../middleware/authenticate";

const router = express.Router();

// router.post("/", (req, res) => {
//   const { email, password, username } = req.body.user;
//   const user = new User({ email, username });
//   user.setPassword(password);
//   user.setConfirmationToken();
//   user
//     .save()
//     .then(userRecord => {
//       sendConfirmationEmail(userRecord);
//       res.json({ user: userRecord.toAuthJSON() });
//     })
//     .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
// });


router.post("/", (req, res) => {
  	const { email, password, username, name } = req.body.user;
  	const passwordHash = password;
  	const user = new User({ name, email, username, passwordHash });

	user.setConfirmationToken();
	// user.save();

	res.json({ user: {username: username}})
  	// user.save().then(userRecord => {
   //    // sendConfirmationEmail(userRecord);
   //    res.json({ user: userRecord.toAuthJSON() });
   //  })
   //  .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));


	// .then(userRecord => {
 //  		// sendConfirmationEmail(userRecord);
 //  		res.json({ user: userRecord.toAuthJSON() });
	// })
	// .catch(err => {

	// 	// console.log(err);
	// 	res.status(400).json({ errors: parseErrors(err.errors) }) 
	// });

});






// Check tomorrow - something is causing site to crash on production //




// router.post("/", (req, res) => {

//   let user = req.body.user;

//   console.log(user);
//   // const user = new User({ email, username });
//   // console.log('Attempt', user);
	
//   // res.status(400).json({ errors: 'error' });

//   let newUser = new User()

//   newUser.createNewUser(user).then(user => {
//   	console.log(user);
//   	newUser.save();
//   	res.json({ user: newUser.toAuthJSON() });
//   })

//   // user.setPassword(user.password).then(() => {
//   // 	user
//   //   .save()
//   //   .then(userRecord => {
//   //     // sendConfirmationEmail(userRecord);
//   //     console.log('Success', userRecord);
//   //     res.json({ user: userRecord.toAuthJSON() });
//   //   })
//   //   .catch(err => {
//   //   	console.log("ERROR", err);
//   //   	res.status(400).json({ errors: parseErrors(err.errors) });
//   //   })

//   // });
//   // user.setConfirmationToken();
  
// });



// router.post('/', (req, res) => {
//   res.json({user: {username: 'test'}})
// });

module.exports = router;
