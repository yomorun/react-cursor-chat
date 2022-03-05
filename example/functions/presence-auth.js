const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    if (event.httpMethod === 'GET') {
        try {
            const response = await fetch('https://prsc.yomo.dev/api/v1/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    app_id: process.env.APP_ID,
                    app_secret: process.env.APP_SECRET,
                }),
            });
            const data = await response.json();
            const token = data.data;
            if (token) {
                return {
                    statusCode: 200,
                    body: JSON.stringify(token),
                };
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ msg: data.message }),
                };
            }
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ msg: error.message }),
            };
        }
    } else {
        return {
            statusCode: 400,
            body: JSON.stringify({ msg: '' }),
        };
    }
};
