const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../Schematics/User");
const Post = require("../Schematics/Post");
const LocalStrategy = require("passport-local").Strategy;
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
// mongoose.set("debug", true);

// Passport
passport.use(
    new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            // console.log(user);
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: "Err" });
            }
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    // passwords match! log user in
                    return done(null, user);
                } else {
                    // passwords do not match!
                    return done(null, false, { message: "Incorrect password" });
                }
            });
        });
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
router.use(passport.initialize());
router.use(passport.session());

// Create Post
router.post("/create-post", (req, res, next) => {
    // jwt.verify(req.token, process.env.SECRET_KEY, (err, authData) => {
    // if (err) {
    //     res.sendStatus(403);
    // } else {
    const post = new Post({
        title: req.body.postTitle,
        body: req.body.postBody,
        user: req.body.username,
        added: new Date(),
    }).save((err) => {
        if (err) {
            return next(err);
        }
        res.json(post);
        console.log("Success");
    });

    // }
    // });
});
router.post("/sign-up", (req, res, next) => {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
            return next(err);
        }
        const user = new User({
            username: req.body.username,
            password: hashedPassword,
            isCaregiver: req.body.isCaregiver,
            isPatient: req.body.isPatient,
        }).save((err) => {
            if (err) {
                return next(err);
            }
            // res.redirect("/");
            res.json(user);
        });
    });
});
// Create Post
router.post("/comment", (req, res, next) => {
    const comment = new Comment({
        commentingOnId: req.body.commentingOnId,
        username: req.body.username,
        title: req.body.title,
        body: req.body.body,
        added: new Date(),
    }).save((err) => {
        if (err) {
            return next(err);
        }
    });
});
// Set Post to Publish
router.post("/publishPost", (req, res, next) => {
    Post.findOneAndUpdate(
        { _id: req.body.postId },
        {
            publish: true,
        },
        function (err, docs) {
            res.json(docs);
        }
    );
});
// Set Post to UNPublish
router.post("/unpublishPost", (req, res, next) => {
    Post.findOneAndUpdate(
        { _id: req.body.postId },
        {
            publish: false,
        },
        function (err, docs) {
            res.json(docs);
        }
    );
});

router.post("/deletePost", (req, res, next) => {
    Post.findByIdAndRemove(req.body.postId, function deleteMessage(err) {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

router.post("/editPost", (req, res, next) => {
    const updatedPost = {
        title: req.body.postTitle,
        body: req.body.postBody,
    };
    Object.keys(updatedPost).forEach(
        (k) => updatedPost[k] == "" && delete updatedPost[k]
    );
    Post.findByIdAndUpdate(
        req.body.updateId,
        updatedPost,
        function updateMessage(err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        }
    );
});

router.get("/log-out", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        // res.redirect("/");
        res.send("logged out");
    });
});

router.post("/log-in", function (req, res, next) {
    passport.authenticate("local", { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: "Something is not right",
                user: user,
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            // const token = jwt.sign({ user }, process.env.SECRET_KEY, {
            // expiresIn: "1200s",
            // });
            return res.json({ user });
        });
    })(req, res);
});
// Authorization: Bearer <access_token>
// Verify Token
// function verifyToken(req, res, next) {
//     // Get auth header value
//     const bearerHeader = req.headers["authorization"];
//     // Check if bearer is undefined
//     if (typeof bearerHeader !== "undefined") {
//         // Split at the space
//         const bearer = bearerHeader.split(" ");
//         // Get token from array
//         const bearerToken = bearer[1];
//         //Set the token
//         req.token = bearerToken;
//         //Call next
//         next();
//     } else {
//         // Forbidden
//         res.sendStatus(403);
//     }
// }
router.get("/getPosts", (req, res) => {
    Post.find({ publish: true }, (err, result) => {
        if (err) {
            res.json(err);
        }
        res.json(result);
    });
});
router.get("/getUsers", (req, res) => {
    User.find({}, (err, result) => {
        if (err) {
            res.json(err);
        }
        res.json(result);
    });
});
router.get("/getReplies", (req, res) => {
    Comment.find({}, (err, result) => {
        if (err) {
            res.json(err);
        }
        res.json(result);
    });
});
router.get("/", function (req, res) {});

module.exports = router;
