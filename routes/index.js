var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	res.send('welcome to the design dino api');
});

router.get('/customers', function(req, res, next) {
  const customers = [
		{
			id: 1,
			firstName: "Chase",
			lastName: 'Poirier'
		},
		{
			id: 2,
			firstName: "Madison",
			lastName: "Yocum"
		},
		{
			id: 3,
			firstName: "Ishan",
			lastName: "Chhabra"
		}
	];

	res.json(customers);
});

module.exports = router;
