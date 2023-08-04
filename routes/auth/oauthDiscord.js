const express = require('express');
const config = require('../../config.json');
const sendMetadataToDiscord = require("../../util/sendMetadataToDiscord.js")
const router = express.Router();
const user = require('../../database/mongoConnect.js')

router.get('/login/callback', async (req, res) => {
    const code = await req.query.code;

    if (code) {
        try {
            const oauth = await fetch(`https://discord.com/api/oauth2/token`, {
                method: 'POST',
                body: new URLSearchParams({
                    client_id: config.oauth.clientId,
                    client_secret: process.env.CLIENT_SECRET,
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: config.oauth.callbackURL,
                    scope: config.oauth.scope,
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            });

            const oauthData = await oauth.json();

            if (JSON.stringify(oauthData.scope.split(" ").sort()) !== JSON.stringify(config.oauth.scopes.sort())) return redirectToLogin(res);


            const userResult = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });
            const result = await userResult.json();

            const userData = await user.findOne({ _id: result.id });

            if (!userData) {
                new user({
                    _id: result.id,
                    isPremium: false
                }).save().catch(err => console.log(err));
                await sendMetadataToDiscord(oauthData.token_type, oauthData.access_token, false)
                console.log(`[MONGO] User: ${result.username} is saved in the database!`);
            }

            req.session.user_info = result;
            req.session.bearer_token = oauthData.access_token;
            req.session.db_info = userData;

            console.log(`[LOGIN] User ${result.username} just logged in!`);
        } catch (err) {
            console.log(err);
            res.redirect('/error');
        }
    }
    //visited website before

    res.redirect('/');
});

router.get('/login', (req, res) => {
    redirectToLogin(res);
});

router.get('/logout', (req, res) => {
    if (!req.session.bearer_token) {
        res.redirect('/');
    } else {
        req.session.destroy();
        res.redirect('/');
    }
})


module.exports = router;

function redirectToLogin(res) {
    return res.redirect(`https://discord.com/api/oauth2/authorize` +
        `?client_id=${config.oauth.clientId}` +
        `&redirect_uri=${encodeURIComponent(config.oauth.callbackURL)}` +
        `&response_type=code&scope=${encodeURIComponent(config.oauth.scopes.join(" "))}&prompt=consent`);
}