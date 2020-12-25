var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment"),
	mongoose   = require("mongoose"),
	seedDB     = require("./seeds")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine", "ejs");
seedDB();

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
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
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

app.get("/campgrounds/:id/comments/new", function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res){
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


app.listen(3000, function(){
	console.log("The Server has started!");
});