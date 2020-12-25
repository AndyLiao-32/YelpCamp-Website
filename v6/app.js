var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
	passport   = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	User       = require("./models/user"),
	mongoose   = require("mongoose"),
	seedDB     = require("./seeds");

//requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentsRoutes   = require("./routes/comments"),
	indexRoutes      = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
// seedDB(); // seed database

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

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(indexRoutes);


app.listen(3000, function(){
	console.log("The Server has started!");
});