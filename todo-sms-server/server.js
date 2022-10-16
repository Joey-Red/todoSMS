const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const routeConfig = require("./routes/routes");
const cors = require("cors");
const MemoryStore = require("memorystore")(session);
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const { ReadStream } = require("fs");
// Connect To DB
dotenv.config();
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(
    mongoDb,
    { useUnifiedTopology: true, useNewUrlParser: true },
    (err, client) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("no err");
        }
    }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());
app.use(
    helmet({
        crossOriginResourcePolicy: false,
    })
);
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(
    session({
        cookie: { maxAge: 86400000 },
        store: new MemoryStore({
            checkPeriod: 86400000,
        }),
        resave: false,
        saveUninitialized: true,
        secret: "dogs",
    })
);

app.use(compression());
app.use(express.static("public"));

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
// Init gfs

let gfs, gridfsBucket;
db.once("open", () => {
    // gfs = Grid(db.db, mongoose.mongo);
    gridfsBucket = new mongoose.mongo.GridFSBucket(db.db, {
        // gfs.collection("uploads");
        bucketName: "uploads",
    });
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection("uploads");
});
// create storage engine
const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename =
                    buf.toString("hex") + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads",
                };
                resolve(fileInfo);
            });
        });
    },
});
const upload = multer({ storage });
// Routes
// POST /upload upload to db
app.post("/upload", upload.single("file"), (req, res) => {
    res.json({ file: req.file });
});
// display files in JSON
// @route GET /files
// @desc  Display all files in JSON
app.get("/files", (req, res) => {
    gfs.files.find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: "No files exist",
            });
        }

        // Files exist
        return res.json(files);
    });
});
app.get("/files/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists",
            });
        }
        // File exists
        return res.json(file);
    });
});
// Get media/:filename
app.get("/media/:filename", (req, res) => {
    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
        // Check if file
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: "No file exists",
            });
        }
        // Check if audio file
        if (file.contentType === "audio/mpeg" || "audio/ogg") {
            // Read output to browser
            // const readstream = gfs.createReadStream(file.filename);
            // readstream.pipe(res);
            const readStream = gridfsBucket.openDownloadStream(file._id);
            readStream.pipe(res);
        } else {
            res.status(404).json({
                err: "Not an audio file",
            });
        }
    });
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete("/files/:id", (req, res) => {
    gfs.remove({ _id: req.params.id, root: "uploads" }, (err, gridStore) => {
        if (err) {
            return res.status(404).json({ err: err });
        }
        // res.redirect("/");
    });
});
app.use("/", routeConfig);

app.listen(process.env.PORT || 8080, () => console.log(`app listening 8080`));
module.exports = app;
