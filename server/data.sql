

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
    reply_to VARCHAR(255)
);

CREATE TABLE likes (
    thread_id VARCHAR (255) PRIMARY KEY,
    user_id VARCHAR (255)
    
    );

CREATE TABLE replies (
    thread_id VARCHAR (255),
    reply_from VARCHAR (255),
    reply_to VARCHAR (255),
    
    text VARCHAR (255),
    timestamp VARCHAR (255),
    FOREIGN KEY (thread_id) REFERENCES threads(id)

    );

 CREATE TABLE activities(
    notification_type VARCHAR (255), 
     sender_id VARCHAR (255), 
     recipient_id VARCHAR (255), 
     timestamp VARCHAR (255),     
    post_id VARCHAR (255),              
    read_status VARCHAR (255),
 );
 