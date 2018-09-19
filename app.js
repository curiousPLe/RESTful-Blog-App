var express = require("express"),
app = express(),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose");

//APP CONFIG
mongoose.connect("mongodb://localhost/restblog_app",{ useNewUrlParser: true });
app.set("view engine", "ejs"); //so you don't need ejs as "index.ejs")
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true})); 
app.use(methodOverride("_method"));

//MONGOOSE/MODEL Config
var blogSchema = new mongoose.Schema({  //set Schema
    title: String,
    image: String, // {type: String, default: "placeholderimage.jpeg"} -- for ex: dafault image 
    body: String,
    dateCreated: 
        {
            type: Date,
            default: Date.now
            
        } //set default time -- no user input for time created -- object 
});

var Blog = mongoose.model("Blog", blogSchema); //setmodel -- object

//RESTFUL ROUTES CONFIG
app.get("/", function(req,res){    //always get redirected to /blogs even without the index
    res.redirect("/blogs");
})
//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!")
        } else {
            res.render("index", {blogposts: blogs}); //passing the data from database (blogs) and sending to "blogsdata" variable
        }
    }); //find everything & retrieve blogs from database 
})
// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
})
//CREATE ROUTE
app.post("/blogs",function(req,res){
    //create blog
    Blog.create(req.body.blog, function(err, newBlog){
        if (err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    })
    //redirect to index
})
//SHOW ROUTE
app.get("/blogs/:id",function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if (err){
            res.send(err)
        } else {
            res.render("show", {blog:foundBlog});
        }
    });
});

// //EDIT/UPDATE 
//   Add Edit Route
//   Add Edit Form 
//   Add Update Route
//   Add Update Form 
//   Add Method-Override 
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.send(err);
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

app.put("/blogs/:id?", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){ //id, newData from form, callback
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    }) 
})

//DESTROY
app.delete("/blogs/:id?", function(req, res){
    //destroy blog
    Blog.findByIdAndRemove(req.params.id, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs"); //good practice
        }
    });
    //redirect somewhere
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("SERVER IS RUNNING!");
})
