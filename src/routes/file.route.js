import express from "express";
import auth from "../middleware/auth.js";
import { ref, getDownloadURL, uploadBytesResumable, storage, deleteObject } from "../../firebase-config.js";
import multer from "multer";
import { v4 } from "uuid";
import File from "../models/files.model.js";
import Comment from "../models/comments.model.js";
import pdf2img from 'pdf-img-convert';

const router = express.Router();
const upload = multer();

router.post("/upload", auth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No files were uploaded.");
        }

        const file = req.file;
        const fileName = file.originalname;
        const metadata = {
            contentType: file.mimetype
        };

        const fileID = v4();
        const storageRef = ref(storage, `files/${fileID}`);
        const upload = await uploadBytesResumable(storageRef, file.buffer, metadata);
        const url = await getDownloadURL(upload.ref);

        const pdfArray = await pdf2img.convert(url);

        let thumbnailURL = "";

        for (let i = 0; i < 1; i++) {
            const imageBuffer = pdfArray[i];
            const imageRef = ref(storage, `thumbnails/${fileID}`);
            const imageUpload = await uploadBytesResumable(imageRef, imageBuffer, { contentType: 'image/png' });
            thumbnailURL = await getDownloadURL(imageUpload.ref);
        }

        const newFile = new File({
            fileID,
            fileName,
            fileURL: url,
            uploadedBy: req.user.id,
            thumbnailURL,
            uploadedOn: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
            numberOfPages: pdfArray.length
        });

        await newFile.save();

        res.status(200).send(newFile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

router.delete("/delete/:id", auth, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).send("File not found");
        }

        if (file.uploadedBy.toString() !== req.user.id) {
            return res.status(401).send("User not authorized");
        }

        await file.deleteOne();

        const comments = await Comment.findOne({ fileID: req.params.id });
        if (comments) {
            await comments.deleteOne();
        }

        const storageRef = ref(storage, `files/${file.fileID}`);
        await deleteObject(storageRef);

        const thumbnailRef = ref(storage, `thumbnails/${file.fileID}`);
        await deleteObject(thumbnailRef);

        res.status(200).send("File deleted successfully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

router.get('/allFiles', auth, async (req, res) => {
    try {
        const files = await File.find({ uploadedBy: req.user.id });
        res.status(200).send(files);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).send("File not found");
        }
        res.status(200).send(file);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

export default router;
