const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

var _ = require("lodash");
var AutoIncrement = require('mongoose-sequence')(mongoose);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const connection = mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("Public"));


// var postDate = new Date();
// DOCUMENT SCHEMA
const PostsSchema = new mongoose.Schema({

  title: String,
  content: String,
  date: Date
});

PostsSchema.plugin(mongoosePaginate);
const Post2 = mongoose.model("Post2", PostsSchema);
// Post2.paginate().then({});


// HOMEPAGE--
app.get("/", function(req, res) {

  Post2.find({}, function(err, foundPosts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        pageTitle: "Home",
        pageContent: homeStartingContent,
        posts: foundPosts
      });
    }
  })

});


// COMPOSSEPAGE
app.get("/composse", function(req, res) {
  res.render("composse", {
    pageTitle: "Composse"
  });
})

const date = new Date ();
app.post("/composse", function(req, res) {

  const newPost = new Post2({
    title: req.body.newPostTitle,
    content: req.body.newPostContent,
    date: Date()
  });

  newPost.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});


app.get("/about", function(req, res) {
  res.render("about", {
    pageTitle: "About",
    pageContent: aboutContent
  });
})

app.get("/contact", function(req, res) {
  res.render("contact", {
    pageTitle: "Contact",
    pageContent: contactContent
  });
});

// GET RANDOM PAGE POSTS
app.get("/posts/:postTitle", function(req, res) {
  const postName = _.capitalize(req.params.postTitle);
// console.log(postName);

  Post2.findOne({
    title: postName
  }, function(err, post) {
    const storedTitle = post.title;
    const storedContent = post.content;

    if (!err) {
      console.log(post);
      res.render("posts", {
        pageTitle: storedTitle,
        pageContent: storedContent
      });
    }
  });
});

app.post("/posts/:postTitle", function(req, res){
  const nextPost = req.body.nextPost;
  // console.log(nextPost._id);

  Post2.findOne({title: {$gt: nextPost}}, function(err, postFound){
    if(postFound){
      const postId = postFound._id
      // console.log(postFound);
      res.redirect("/posts/" + postFound.title );
    }})


});



// POST DELETE---
app.post("/delete", function(req, res) {
  const deletePost = req.body.deletePost;

  Post2.findOneAndRemove({
    title: deletePost
  }, function(err, post) {
    if (!err) {
      console.log(post.title + " REMOVED!");
      res.redirect("/");
    }
  })
});


app.listen(3000, function() {
  console.log("Server on Port 3000");
})
