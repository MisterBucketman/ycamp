var express = require("express"),
    passport = require("passport"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash")
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground.js"),
    Comment = require("./models/comment.js"),
    User = require("./models/user.js"),
    seedDB = require("./seeds.js")

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index")


mongoose.connect("mongodb://localhost:27017/yelp_camp",{ useUnifiedTopology: true, useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended : true}));
app.set ("view engine","ejs"); 
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
seedDB();


 Campground.create(
    {
        name: "Granite Hill", 
        image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "This is a nice place"
    },function(err,campground){
        if(err){
            console.log(err)
        }else{
            console.log("Newly created Campground")
            console.log(campground)
        }
    }
) 


//PASSPORT--CONFIGURATION//

app.use(require("express-session")({
    secret : "Once again biatch",
    resave : false,
    saveUninitialized : false
}));

app.use(passport.initialize())
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use("/",indexRoutes)
app.use("/campgrounds/:id/comments",commentRoutes)
app.use("/campgrounds",campgroundRoutes)

//comments routes//

//AUTH-ROUTES//

app.listen(4000,function(){ 
    console.log("The YelpCamp server has started"); 
});