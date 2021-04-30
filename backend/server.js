const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const knex = require('knex');
const cors = require('cors');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');
const image = require('./controllers/image');

const db = knex({
	client: 'pg',
	connection: process.env.POSTGRES_URI,
});

const corsOptions = {
	origin: '*'
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/', (req, res) => { res.send('Home page') });
app.post('/signin', signin.signInAuthentication(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.post('/profile/:id', auth.requireAuth, profile.handleProfileUpdate(db, bcrypt));
app.get('/profile/:id', auth.requireAuth, profile.handleProfileGet(db));
app.put('/image', auth.requireAuth, image.handleImage(db));
app.put('/imageurl', auth.requireAuth, image.handleApiCall());

app.listen(process.env.SERVER_PORT, () => {
	console.log("Server is running!");
});