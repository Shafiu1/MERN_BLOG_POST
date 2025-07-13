// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
const postRoutes = require('./routes/posts');
app.use('/api/posts', postRoutes);

// DB & Server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`));
    })
    .catch(err => console.error(err));

//Auth..
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);
