import express from 'express';
import auth from '../middleware/auth.js';
import Comment from '../models/comments.model.js';
import mongoose from 'mongoose';

const router = express.Router();

const findParentComment = async (comment, parentCommentID) => {
    if (String(comment._id) === String(parentCommentID)) {
        return comment;
    }
    for (const nestedComment of comment.comments) {
        const parentComment = await findParentComment(nestedComment, parentCommentID);
        if (parentComment) {
            return parentComment;
        }
    }
    return null;
};

router.post('/add', auth, async (req, res) => {
    try {
        const { fileID, parentCommentID, comment } = req.body;
        let commentDoc = await Comment.findOne({ fileID: fileID });
        if (!commentDoc) {
            commentDoc = new Comment({
                fileID,
                user: req.user.id,
                comments: []
            });
        }

        const newComment = {
            _id: new mongoose.Types.ObjectId(),
            user: req.user.id,
            comment: comment,
            commentBy: req.user.name,
            comments: []
        };

        if (parentCommentID) {
            const parentComment = await findParentComment(commentDoc, parentCommentID);
            if (!parentComment) {
                return res.status(404).json({ message: "Parent comment not found" });
            }
            parentComment.comments.push(newComment);
        } else {
            commentDoc.comments.push(newComment);
        }

        await commentDoc.save();

        return res.status(201).json(commentDoc);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

router.get('/file/:fileID', async (req, res) => {
    try {
        const comments = await Comment.findOne({ fileID: req.params.fileID });
        if (!comments) {
            return res.status(200).json([]);
        }
        return res.json(comments.comments);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

export default router;
