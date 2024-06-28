const mongoose = require('mongoose');
const {Schema} = mongoose;

const PostsSchema = new Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    img: { 
        data: Buffer, 
        contentType: String,
    },
    postedBy:{
        type: String,
    },
    title:{
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true,
    },
    tag :{
        type: String,
        default : "General"
    },
    comments: [{
        name: {
            type: String,
        },
        comment: {
            type: String,
        }
    }],
    likes: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
          name: String,
        },
    ],
    likeCount: {
        type: Number,
        default: 0,
      },
    date:{
        type: Date,
        default: Date.now
    }
  });

  module.exports = mongoose.model('posts',PostsSchema);
  