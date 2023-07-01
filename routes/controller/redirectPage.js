const express = require('express');
const router = express.Router();

router.get('/add', (req, res) => {
    res.redirect('https://discord.com/');
});

router.get('/github', (req, res) => {
    res.redirect('https://github.com/SjemPotje');
});

router.get('/discord', (req, res) => {
    res.redirect('https://discord.gg/');
});

module.exports = router; 