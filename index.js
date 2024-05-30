import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import connectDB from './src/config/db.js';
import userRoute from './src/routes/user.route.js';
import fileRoute from './src/routes/file.route.js';
import commentRoute from './src/routes/comments.route.js'

const app = express();
const port = 5000;

await connectDB();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send(`<div><p>APIs are up and running</p><p>Database is connected</p></div>`);
});

app.use('/api/user', userRoute);

app.use('/api/file', fileRoute);

app.use('/api/comment', commentRoute);

app.listen(port, () => {
    console.log('Server is running on port', port);
});