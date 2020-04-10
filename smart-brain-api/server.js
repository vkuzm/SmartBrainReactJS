const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
	client: 'pg',
	connection: {
		host: '127.0.0.1',
		post: '54320',
		user: 'postgres',
		password: 'password',
		database: 'smartbrain'
	}
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
	{
		id: 123,
		name: 'John',
		email: 'john@gmail.com',
		password: 'cookies',
		entries: 0,
		joined: new Date()
	},
	{
		id: 124,
		name: 'Sally',
		email: 'sally@gmail.com',
		password: 'bananas',
		entries: 0,
		joined: new Date()
	}
	]
}

app.get('/', (req, res) => {
	db('users').then(users => {
		res.send(users);
	});
})

app.post('/signin', (req, res) => {
	const { email, password } = req.body;	

	db.select('hash')
	.from('login')
	.where('email', '=', email)
	.first()
	.then(data => {
		if (data) {
			const isValid = bcrypt.compareSync(password, data.hash); 

			if (isValid) {
				return db.select('*')
					.from('users')
					.where('email', '=', email)
					.first()
					.then(user => res.json(user));
			}
		}
		return res.status(400).json('Email or password is invalid');
	})
	.catch(() => {
		res.status(400).json('Unable to sign in');
	})
})

app.post('/register', async (req, res) => {
	const { email, name, password } = req.body;	
	const hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				.returning('*')
				.insert({
					name: name,
					email: email,
					joined: new Date()
				})
				.then(user => {
					res.status(201).json(user[0]);
				})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(() => {
		res.status(400).json('Unable to register new user');
	});
})

app.get('/profile/:id', (req, res) => {
	const userId = Number(req.params.id);

	db('users')
	.select('*')
	.where('id', userId)
	.first()
	.then(user => {
		if (user) {
			res.json(user);
		} else {
			res.status(400).json('User not found');
		}
	})
	.catch(() => {
		res.status(400).json('Unable to get user profile');
	})
})

app.put('/image', (req, res) => 	{
	const userId = Number(req.body.id);
	const count = Number(req.body.count);

	db('users')
	.where('id', '=', userId)
	.increment('entries', count)
	.returning('entries')
	.then(entries => {
		res.json(entries);
	})
	.catch(() => {
		res.status(400).json('Unable to increase a counter of entries');
	})
})

app.listen(3001, () => {
	console.log("Server is running!");
})