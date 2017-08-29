const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mc = require(`${__dirname}/controllers/messages_controller`);

const createInitialSession = require('./middlewares/session.js');
const filter = require('./middlewares/filter');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../public/build`));

app.use((req, res, next) => {
    const method = req.method;
    if (method === "POST" || method === "PUT") {
        filter(req, res, next)
    } else {
        next();
    }
})

app.use(function (req, res, next) {
    createInitialSession(req, res, next)
})

app.use(session(
    {
        secret: 'iSolemnlySwearImUpToNoGood',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 10000 }
    }
));


const messagesBaseUrl = "/api/messages";
app.post(messagesBaseUrl, mc.create);
app.get(messagesBaseUrl, mc.read);
app.put(`${messagesBaseUrl}`, mc.update);
app.delete(`${messagesBaseUrl}`, mc.delete);
app.get(`${messagesBaseUrl}/history`, mc.history);

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}.`); });