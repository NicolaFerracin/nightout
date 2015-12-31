var Bar = require('./models/bar');  // load the Bar mongoose model
var User = require('./models/user');  // load the User mongoose model for passport.js authentication

module.exports = function(app, passport, Yelp) {

	// Request API access: http://www.yelp.com/developers/getting_started/api_access
	var yelp = new Yelp({
		consumer_key: '85gi01lH5Ke4OEa-Y4Pchg',
		consumer_secret: 'baIT7TRI73hsZOvJgUFSogFAGLw',
		token: '9FJBinieVJyVx6WAHkwokA72lX8x9Sb4',
		token_secret: 'EV-lIptQel4vBkWXOX2dZN9vdgk',
	});

	// api ---------------------------------------------------------------------
	// yelp search by latitude and longitude
	app.get('/api/yelp/:lat/:lon', function(req, res) {
		// See http://www.yelp.com/developers/documentation/v2/search_api
		yelp.search({ term: 'bar', ll: req.params.lat + "," + req.params.lon})
		.then(function (data) {
			res.json(data);
		})
		.catch(function (err) {
			res.send(err);
		});
	});

	// yelp search by location
	app.get('/api/yelp/:location', function(req, res) {
		// See http://www.yelp.com/developers/documentation/v2/search_api
		yelp.search({ term: 'bar', location: req.params.location })
		.then(function (data) {
			res.json(data);
		})
		.catch(function (err) {
			res.send(err);
		});
	});


	// create bar entry and add the yelp_id of the bar to the user going
	app.post('/api/bar', function(req, res) {
		Bar.create({
			yelp_id : req.body.id,
			going : req.body.going,
		}, function(err, bar) {
			if (err) {
				res.send(err);
			}
			res.json(bar);
		});
	});

// process the login form
// Express Route with passport authentication and custom callback
app.post('/api/login', function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (user === false) {
			res.status(401).send(req.flash('loginMessage'));
		} else {
			req.login(user, function(err) {
				if (err) {
					res.status(500).send("There has been an error");
				} else {
					console.log(user)
					res.status(200).send("success!");
				}
			});
		}
	})(req, res, next);
});

// process the signup form
// Express Route with passport authentication and custom callback
app.post('/api/signup', function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (user === false) {
			res.status(401).send(req.flash('signupMessage'));
		} else {
			res.status(200).send("success!");
		}
	})(req, res, next);
});

app.get('/loggedin', function(req, res) {
	if (req.isAuthenticated()) {
		var user = req.user;
		// hide sensible information
		user.local = {};
		res.json(req.user);
	}
	else {
		res.json(undefined);
	}
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


// update a user entry with new bar
app.post('/api/user/:email/:bars', function(req, res) {
	User.findOne({ 'local.email' :  req.params.email }, function(err, user) {
		if (err) {
			res.send(err);
		}
		user.bars = req.params.bars;
		user.save(function(err) {
			if (err) return next(err)
			req.login(user, function(err) {
				if (err) {
					return next(err)
				}
				res.sendStatus(200)
			})
		})

	});
});



};
