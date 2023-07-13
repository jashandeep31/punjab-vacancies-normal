const axios = require("axios");
const keys = require("./keys.json");
const { google } = require("googleapis");

const sendTelegramMessage = async (message) => {
    console.log("function message");

    await axios.get(
        `https://api.telegram.org/bot5807756495:AAFG13m3ZeIddWVGAAGtdalmkUCj87_iYsQ/sendMessage?chat_id=-932486385&`,
        {
            params: {
                text: `${message}`,
                parse_mode: "HTML",
            },
        }
    );
};

const sendRequest = (url, type, token) => {
    axios
        .post(
            "https://indexing.googleapis.com/v3/urlNotifications:publish",
            {
                url: url,
                type: type,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then((res) => {
            sendTelegramMessage(JSON.stringify(res.data));
            console.log("function padded again");
        })
        .catch((err) => {
            sendTelegramMessage("error took place");
            sendTelegramMessage(JSON.stringify(err.response.data));
        });
};

const indexingFunction = async (url, type) => {
    const googleIndexClient = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ["https://www.googleapis.com/auth/indexing"],
        null
    );
    console.log("function called");

    googleIndexClient.authorize(function (err, tokens) {
        if (err) {
            return;
        } else {
            console.log("function passed");

            sendRequest(url, type, tokens.access_token);
        }
    });
};

module.exports = indexingFunction;
