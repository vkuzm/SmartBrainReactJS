	
	#1 Start database in Docker
	
	1) 
	cd smart-brain-api && docker-compose up -d
	
	2) 
	docker exec -it smart-brain-db psql -U postgres -c "create database smartbrain"
	
	3)
	docker exec -it smart-brain-db psql -U postgres && \connect smartbrain
	
	4) 
	CREATE TABLE users (
		id serial PRIMARY KEY, 
		name VARCHAR(100), 
		email TEXT UNIQUE NOT NULL, 
		entries BIGINT DEFAULT 0,
		joined TIMESTAMP NOT NULL
	);    
	
	5)
	CREATE TABLE login (
		id serial PRIMARY KEY,
		hash varchar(100) NOT NULL,
		email text UNIQUE NOT NULL
	);


	#2 Start back-end API
	npm start

	#3 Start front-end APP
	cd ../smart-brain-app && npm start

	#4 Go to http://localhost:3000