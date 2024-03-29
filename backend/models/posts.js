//Defining schema for Posts.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { AWS_BUCKET_NAME, AWS_BUCKET_REGION } = require("../utils/config");

/*
 * function contentToUrl(content){
 *     console.log(content);
 *     return `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${content}`;
 * }
 */

const postsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    content: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 300,
        // get:contentToUrl
    },
    content_type:{
        type:String,
        required:true,
        default:"text"
    },
    votes: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the post is created",
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the post is updated",
    },
    tags: [
        {
            type: String,
            maxLength: 30,
        },
    ],
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    community_name:String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username:String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

postsSchema.plugin(uniqueValidator);
postsSchema.path("content_type").validate((contentType)=>{
    let allowedTypes = ["image","text"];
    return allowedTypes.includes(contentType.toLowerCase());
});

 
postsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        if(returnedObject.content_type==="image"){
            returnedObject.content = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${returnedObject.content}`;
        }
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Posts = new mongoose.model("Posts", postsSchema);

module.exports = Posts;
