var express    = require("express"),
	router     = express.Router(),
	passport   = require("passport"),
	User       = require("../models/user");

// Landing Page
router.get("/", function(req, res){
	res.render("landing");
});

// ===============
//   Auth ROUTES
// ===============

// Show register routes
router.get("/register", function(req, res){
	res.render("register", {page: 'register'});
});

// handle sign up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//Show login form
router.get("/login", function(req, res){
	res.render("login", {page: 'login'});
});

//handle login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

// Logout Routes
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;