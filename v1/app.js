var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
	{name: "Salmon Creek", image: "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e5074417d2873d6944ec0_340.jpg"},
	{name: "Granite Hill", image: "https://pixabay.com/get/55e8dc404f5aab14f1dc84609620367d1c3ed9e04e5074417d2873d6944ec0_340.jpg"},
	{name: "Mountain Goat's Rest", image:"https://pixabay.com/get/52e5d7414355ac14f1dc84609620367d1c3ed9e04e5074417d2873d6944ec0_340.jpg"}
]

app.get("/", function(req, res){
	res.render("landing");
});

app.get("/campgrounds", function(req, res){
	res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
	res.render("new");
});


app.listen(3000, function(){
	console.log("The Server has started!");
});