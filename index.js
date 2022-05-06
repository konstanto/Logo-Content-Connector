import express from 'express';
import fetch from 'node-fetch';

var app = express();

var PORT = process.env.PORT || 3000;

app.post('/oauth/token', function(req, res) {
    const response = {
        access_token: "no-auth"
    }

    res.send(response);
});

app.use(express.static('public'));

app.get('/content/:domain/download-url', function(req, res) {
    const url = { downloadUrl: `https://logo.clearbit.com/${req.params.domain}` };
    res.send(url);
});

app.get('/content/', async function(req, res) {
    if (parseInt(req.query.skip) > 1) {
        res.send({
            contentCount: 1,
            offset: 1,
            content: []
        })
        return;
    }

    if (req.query.search == null) {
        res.send({
            contentCount: 1,
            offset: 0,
            content: [{
                id: "https://logoservice.azurewebsites.net/empty.png",
                mimeType: "image/png",
                previewUrl: `https://logoservice.azurewebsites.net/empty.png`,
                name: null,
                tags: null
            }]
        })
        return;
    }

    const domain = req.query.search.indexOf(".") > 0 ? req.query.search : `${req.query.search}.com`

    const response = {
        contentCount: 0,
        offset: 0,
        content: []
    }
    try {
        const test = await fetch(`https://logo.clearbit.com/${domain}`);
        if (test.status === 200) {
            response.content.push({
                id: domain,
                mimeType: "image/png",
                previewUrl: `https://logo.clearbit.com/${domain}`,
                name: `${domain} - from clearbit`,
                tags: domain
            })
            response.contentCount = 1;
        }

    } catch (error) {
        response.contentCount = 0;
    }

    res.send(response);
});

app.get('/', function(req, res) {
    res.status(200);
});

app.listen(PORT, function() {
    console.log('Server is running on PORT:', PORT);
});