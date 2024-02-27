const axios = require('axios');
const flatten = require('flat');
const path = require('path');


async function webhook(req, res) {
    res.send('ok');
    const payload = req.body;
    const flatPayload = flatten(payload, { delimiter: '-' });

    // workflow builder requires values to be strings
    // iterate over every value and convert it to string
    Object.keys(flatPayload).forEach((key) => {
        flatPayload[key] = '' + flatPayload[key];
    })

    axios.post(`https://hooks.slack.com${req.path}`, flatPayload)
}

async function staticPage(req, res) {
    // this route should ask you to post your slack webhook urls and give you the webhook to supply to github
    // (Essentially changes hooks.slack.com to our servers path)
    res.sendFile(path.join(__dirname, './../public/index.html'));
}

export default function handler(req, res) {
    const { url = '', method = '' } = req || {};
    // if (method === 'GET' && url === '/') return staticPage(req, res)

    if (method === 'POST' && (url.includes('/triggers/') || url.includes('/workflows/'))) {
        return webhook(req, res)
    }

    const { name = 'World' } = req.query
    return res.json({
        message: `Hello ${name}, I'm Alive!`,
    })
}