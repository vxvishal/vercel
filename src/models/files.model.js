import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileID: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    fileURL: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    thumbnailURL: {
        type: String,
        required: true
    },
    uploadedOn: {
        type: String,
        required: true
    },
    numberOfPages: {
        type: Number,
        required: true
    }
});

const File = mongoose.model("File", fileSchema);

export default File;