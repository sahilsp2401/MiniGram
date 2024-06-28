const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Post = require('../models/Post'); // Path to your Post model
const multer = require('multer');

const router = express.Router();

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage });

// ROUTE 1: Get all the posts using: GET "/api/potes/fetchallposts".Login required
router.get('/fetchallposts',async (req,res)=>{
    try{
    const posts = await Post.find().sort({ date: -1 });
    const formattedPosts = posts.map(post => ({
        _id: post._id,
        title: post.title,
        description: post.description,
        tag: post.tag,
        img: {
          contentType: post.img.contentType,
          data: post.img.data.toString('base64'), // Convert Buffer to Base64
        },
        comments : post.comments,
        likeCount : post.likeCount,
        likes : post.likes,
        postedBy : post.postedBy,
      }));
    res.json(formattedPosts);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
// ROUTE 2: Add a new Note using: POST "/api/posts/addpost".Login required
router.post('/addpost', fetchuser, upload.single('img'), [
    body('title', "Enter a valid title").isLength({ min: 3 }),
    body('description', "Description must be at least 5 characters").isLength({ min: 5 })
], async (req, res) => {
    try {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Validation Error", details: errors.array() });
        }

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }

        // Extract fields from request
        const { title, description, tag,postedBy } = req.body;

        // Create a new post
        const post = new Post({
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            },
            title,
            description,
            tag,
            postedBy,
            user: req.user
        });

        // Save the post to the database
        const savedPost = await post.save();

        // Respond with the saved post
        res.json(savedPost);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// ROUTE 3: Update an existing Note using: PUT "/api/notes/updatenote".Login required
router.put('/updatepost/:id',fetchuser,[
    body('title',"Enter a valid title").isLength({min:3}),
    body('description',"Description must be atleast 5 characters").isLength({min:5})
],async (req,res)=>{
    let success = false
    try{
        const {title,description,tag} = req.body;
        // Create a newPost object
        const newPost = {};
        if(title){newPost.title = title};
        if(description){newPost.description = description};
        if(tag){newPost.tag = tag};
        // Find the note to be updated and update it
        let post = await Post.findById(req.params.id);
        if(!post){
            success = false
            return res.json({success,"Error":"Not Allowed!!"});
        }
        if(post.user.toString()!==req.user){
            success = false
            return res.json({success,"Error":"Not Allowed!!"});
        }
        post = await Post.findByIdAndUpdate(req.params.id,{$set:newPost},{new:true})
        success = true
        res.json({success,"Success":"Post as been updated successfuly!!"});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})
// ROUTE 4: Delete an existing Post using: DELETE "/api/posts/deletepost".Login required
router.delete('/deletepost/:id',fetchuser,async (req,res)=>{
    let success = false;
    try{
        let post = await Post.findById(req.params.id);
        if(!post){
            success = false
            return res.json({success,"Failed":"Post can not be deleted!!"});
        }
        if(post.user.toString()!==req.user){
            success = false
            return res.json({success,"Failed":"Post can not be deleted!!"});
        }
        post = await Post.findByIdAndDelete(req.params.id)
        success = true
        res.json({success,"Success":"Post as been deleted successfuly!!"});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 5: Add a comment to post using: POST "/api/post/comment".Login required
router.post('/addcomment/:id',fetchuser,[
    body('comment', 'Comment must be at least 3 characters long').isLength({ min: 3 })
],async (req,res)=>{
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        success = false
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, comment } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post) {
            success = false
            return res.status(404).json({ error: 'Post not found' });
        }

        // Add the new comment object to the comments array
        post.comments.push({ name, comment });
        const updatedPost = await post.save();

        // Respond with only the title and comments of the updated post
        success = true
        res.json({success,"Success":"Comment posted Successfully!!"});
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }
})

// Route 6:  Like to post using: POST "/api/post/addlike".Login required
router.post('/addlike/:id', fetchuser, async (req, res) => {
    try {
        let success = false;
      const postId = req.params.id;
      const userId = req.user;
      const name = req.body.name; // Assuming name is in the req.user
  
      const post = await Post.findById(postId);
  
      if (!post) {
        success = false
        return res.status(404).json({ error: 'Post not found' });
      }
  
      // Check if the user already liked the post
      const likeIndex = post.likes.findIndex(like => like.userId.toString() === userId);
      if (likeIndex !== -1) {
        // Unlike the post
        post.likes.splice(likeIndex, 1);
        post.likeCount -= 1;
      } else {
        // Like the post
        post.likes.push({ userId, name:name });
        post.likeCount += 1;
      }
  
      const updatedPost = await post.save();
      success = true
      res.json({success,"Success":"Like/Unlike done Successfully!!"});
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  });

module.exports = router