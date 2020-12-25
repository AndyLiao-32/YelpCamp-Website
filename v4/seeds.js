var mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	Comment    = require("./models/comment");

var data = [
	{
		name: "Penghu Island",
	 	image: "https://res.klook.com/image/upload/c_fill,w_960,h_460,f_auto/w_80,x_15,y_15,g_south_west,l_klook_water/activities/u9tfx2hlk3mqh2t0y3un.jpg",
	 	description: "Enjoy a camping trip by the waters of Penghu and try out various activities from evening until you go to sleep in your tent! Get to stay on an uninhabited island in Penghu famous for its magnificent view and variety of water activities to choose from. Start off by meeting up with your guide and fellow camping participants at the South Sea Visitor Center."
	},
	{
		name: "Sunrise Camp",
	 	image: "https://www.tripsavvy.com/thmb/ekAcrsKGhqVjsQvxnMJpjv1ymvw=/2137x1403/filters:fill(auto,1)/sunrise-camping--676019412-5b873a5a46e0fb0050f2b7e0.jpg",
	 	description: "Today, there are numerous kinds of camping camping camping tents. With regards to tent size, this is often frequently described probably the most amount of people it could accommodate. Clearly, the smaller sized sized sized the tent, less people may be covered."
	},
	{
		name: "Kanokkorn Garden",
	 	image: "https://q-xx.bstatic.com/xdata/images/hotel/840x460/174968884.jpg?k=4fcda8ada3a2c30939056d5c0c38a195379efd4ff19c1ceb45079e983988a5c3&o=",
	 	description: "Located in Phrae in the Phrae Province region, Camping Kanokkorn Garden has a garden. Featuring free private parking, the luxury tent is in an area where guests can engage in activities such as hiking and cycling."
	},
]


function seedDB(){
	// Remove all campgrounds
	Campground.remove({}, function(err){
		if(err){
			console.log(err)
		}else{
			console.log("Removed campgrounds!")
			// Add a few campgrounds
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
						console.log(err)
					}else{
						console.log("Added a campground!")
						// Create a comment 
						Comment.create(
							{
								text: "This is a greate place, but I wish there was WIFI!",
								author: "Emeric Schneider"
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created new Comment!");
							}
						})
					}
				});
			});
		}
	});
}

module.exports = seedDB;