var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User       = require("./models/user"),
	mongoose   = require("mongoose"),
	seedDB     = require("./seeds")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
seedDB();

// PASSPORT CONFIG
app.use(require("express-session")({
	secret: "GT Orientation is on 5/31",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass in currentUser into every route
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


// Landing Page
app.get("/", function(req, res){
	res.render("landing");
});

// INDEX -- show all campgrounds
app.get("/campgrounds", function(req, res){
	// Get all campgrounds from Database
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
		}
	})
	// res.render("campgrounds", {campgrounds:campgrounds}); <-- Not from hard-coding
});

// CREATE -- add new campgrounds to DB
app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};
	//Create a new campground and save to the database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err)
		}else{
			res.redirect("/campgrounds");
		}
	})
});

//NEW -- show form to create new campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//SHOW -- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	// find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});


// =======================
// COMMENT ROUTES
// =======================

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				}else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	});
});

// ===============
//   Auth ROUTES
// ===============

// Show register routes
app.get("/register", function(req, res){
	res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err)
			return res.render("register")
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campgrounds");
		});
	});
});

//Show login form
app.get("/login", function(req, res){
	res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

// Logout Routes
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};




app.listen(3000, function(){
	console.log("The Server has started!");
});