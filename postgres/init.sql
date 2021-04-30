BEGIN TRANSACTION;

CREATE TABLE login (
    id serial PRIMARY KEY,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);

CREATE TABLE users (
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    age VARCHAR(3),
    joined TIMESTAMP NOT NULL
);

CREATE TABLE entries (
    user_id BIGINT,
    counter BIGINT DEFAULT 0
);

COMMIT;