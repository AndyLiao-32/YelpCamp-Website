var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

/*
Campground.create({
	name: "Granite Hill", 
	image: "https://pixabay.com/get/52e5d7414355ac14f1dc84609620367d1c3ed9e04e5074417d277ddd9344c4_340.jpg",
	description: "This is a huge granite hill. Beautiful Granite!!"
}, function(err, campground){
	if(err){
		console.log(err)
	}else{
		console.log("Newly Created Campground!")
		console.log(campground);
	}
})
*/

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
			res.render("index", {campgrounds:allCampgrounds});
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
	res.render("new");
});

//SHOW -- shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
	// find the campground with provided id
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			res.render("show", {campground: foundCampground});
		}
	})
});

app.listen(3000, function(){
	console.log("The Server has started!");
});