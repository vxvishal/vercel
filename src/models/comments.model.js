import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  commentBy: {
    type: String,
    required: true
  },
  comments: []
});

commentSchema.add({ comments: [commentSchema] });

const fileCommentSchema = new mongoose.Schema({
  fileID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema]
});

const Comment = mongoose.model('Comment', fileCommentSchema);
export default Comment;