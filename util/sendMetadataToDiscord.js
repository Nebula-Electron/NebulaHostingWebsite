const config = require("../config.json");
module.exports = async function (token_type, access_token, isPremium) {
    const url = `https://discord.com/api/v10/users/@me/applications/${config.oauth.clientId}/role-connection`;
    const body = {
        platform_name: 'Example Linked Role Discord Bot',
        free_customer: toNumber(!isPremium),
        premium_customer: toNumber(isPremium),
    };
    const response = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            Authorization: `${token_type} ${access_token}`,
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        console.error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
        return false
    }
    else return true
}

function toNumber(arg) {
    return arg === true ? 1 : 0;
}