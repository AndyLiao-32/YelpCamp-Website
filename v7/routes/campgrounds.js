var express    = require("express"),
	router     = express.Router(),
	Campground = require("../models/campground"),
	Comment    = require("../models/comment"),
	middleware = require("../middleware");

// INDEX -- show all campgrounds
router.get("/", function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
	var name   = req.body.name;
	var image  = req.body.image;
	var desc   = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
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
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//SHOW -- shows more info about one campground
router.get("/:id", function(req, res){
	// find the campground with provided id
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	})
});

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	// find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
	// redirect to the show place
});

// Destroy Camping Route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
          	res.redirect("/campgrounds");
      	} else {
          	res.redirect("/campgrounds");
      	}
	});
});


module.exports = router;