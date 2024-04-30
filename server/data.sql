

CREATE DATABASE threads;

CREATE TABLE users(
    username VARCHAR(255) PRIMARY KEY,
    hashed_password VARCHAR(255)
);

CREATE TABLE profiles(
    id VARCHAR (255) PRIMARY KEY,
    username VARCHAR (255),
    handle VARCHAR (255),
    bio VARCHAR(255),
    link VARCHAR (255),
    img VARCHAR (255),
    inst_url VARCHAR (255)
);

CREATE TABLE followers(
    leader VARCHAR (255),
    follower VARCHAR(255)

);

CREATE TABLE threads (
    id VARCHAR(255) PRIMARY KEY,
    time_stamp VARCHAR (255),
    thread_from VARCHAR (255),
    text VARCHAR (255)
);

CREATE TABLE likes (
    thread_Id VARCHAR (255) PRIMARY KEY,
    user_Id VARCHAR (255)
    );

CREATE TABLE replies (
    thread_Id VARCHAR (255) PRIMARY KEY,
    replies VARCHAR (255)
    );
