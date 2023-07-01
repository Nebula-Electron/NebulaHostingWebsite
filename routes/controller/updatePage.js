const express = require('express');
const router = express.Router();
const config = require('../../config.json');


const fs = require('fs');

const formparser=require('express-fileupload')
router.use(formparser());

router.use(require("express-session")(config.session));
router.use(express.json({ limit: '10mb' })); // for parsing application/json
router.use(express.urlencoded({ limit: '10mb', extended: true }));

router.get("/", (req, res) => {
    if (!req.session.bearer_token) {
        res.status(200).render("../pages/logged-off/index.ejs");
    } else {
        res.status(200).render("../pages/logged/index.ejs", {
            user: req.session.user_info,
        });
    }
});

router.get("/privacy", (req, res) => {
    if (!req.session.bearer_token) {
        res.status(200).render("../pages/logged-off/privacy.ejs");
    } else {
        res.status(200).render("../pages/logged/privacy.ejs", {
            user: req.session.user_info,
            db: req.session.db_info,
        });
    }
})

router.get("/dashboard", (req, res) => {
    if (!req.session.bearer_token) {
        res.redirect('/login');
    } else {
        res.status(200).render("../pages/logged/dashboard.ejs", {
            user: req.session.user_info,
            db: req.session.db_info,
        });
    }
});

router.get('/del', (req, res) => {
    if (!req.session.bearer_token) {
        res.redirect('/login');
    } else {
        res.status(200).render("../pages/logged/del.ejs", {
            user: req.session.user_info,
            db: req.session.db_info,
        });
    }
})

router.get('/error', (req, res) => {
    if (!req.session.bearer_token) {
        res.status(200).render("../pages/logged-off/error.ejs", {
            error: req.query.error,
        });
    } else {
        res.status(200).render("../pages/logged/error.ejs", {
            user: req.session.user_info,
            error: req.query.error,
        });
    }
});

router.get('/404', (req, res) => {
    if (!req.session.bearer_token) {
        res.status(200).render("../pages/logged-off/404.ejs")
    } else {
        res.status(200).render("../pages/logged-on/404.ejs", {
            user: req.session.user_info
        });
    }
});

module.exports = router;