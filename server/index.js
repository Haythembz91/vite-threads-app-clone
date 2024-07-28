const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const pool = require('./db')
const jwt = require('jsonwebtoken')
const {v4:uuidv4} = require ('uuid')
const bcrypt = require('bcrypt')
const {hash} = require("bcrypt");

// get profiles

app.get('/users/:handle',async (req,res)=>{

    const {handle} = req.params
    try{
        const users = await pool.query('SELECT * FROM profiles WHERE handle=$1;',[handle])
        const followers = await pool.query('SELECT COUNT(follower) FROM followers WHERE leader=$1;',[handle])
        res.json({users:users.rows,followers:followers.rows})
    }catch(err){console.error(err)}
});

// get all users & threads

app.get('/users',async (req,res)=>{


    try{
        const users = await pool.query('SELECT * FROM profiles;')
        res.json(users.rows)
    }catch(err){console.error(err)}

});

// get threads

app.post('/threads',async(req,res)=>{
    const {user}=req.body
    try{
        const threads = await pool.query('SELECT threads.* FROM threads JOIN followers ON threads.thread_from=followers.leader WHERE followers.follower=$1 UNION SELECT * from threads WHERE threads.thread_from=$1;',[user])
        res.json(threads.rows)
    }catch(err){console.error(err)}
})
// get replies 

app.post('/replies',async(req,res)=>{
    const {thread_id}=req.body
    try{
        const replies = await pool.query('SELECT * FROM threads WHERE reply_to=$1',[thread_id])
        res.json(replies.rows)
    }catch(err){console.error(err)}
})

// SIGN UP

app.post('/users/signup',async (req,res)=>{

    const {handle,username,password}=req.body
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password,salt)
    const id = uuidv4()
    try{
        const signUp = await pool.query('INSERT INTO users(username,hashed_password)VALUES($1,$2);',[handle,hashedPassword])
        const addProfile = await pool.query('INSERT INTO profiles(id,username,handle)VALUES($1,$2,$3);',[id,username,handle])
        const token = jwt.sign({handle},'secret',{expiresIn:'1hr'})
        res.json({handle,token})
    }catch(error){console.error(error)
        if (error){
            res.json({detail:error.detail})
        }
    }
})

// LOGIN

app.post('/users/login',async(req,res)=>{

    const {handle,password}=req.body

    try{
        const user = await pool.query('SELECT * FROM users WHERE username=$1;',[handle])
        if(!user.rows.length){
            res.json({detail:`${handle} does not exist`})
        }
        const success = await bcrypt.compare(password,user.rows[0].hashed_password)
        if (success){
            const token = jwt.sign({handle},'secret',{expiresIn:'1hr'})
            res.json({handle,token})
        } else{
            res.json({detail:'wrong password'})
        }
    }catch(error){
        console.error(error)
    }
})

app.post('/post',async(req,res)=>{

    const {poster,thread,time}=req.body
    const id = uuidv4()

    try{
        const post = await pool.query('INSERT INTO threads(id,time_stamp,thread_from,text)VALUES($1,$2,$3,$4);',[id,time,poster,thread])
        res.json(post.rows)
    }catch (error){console.log(error)}
})

app.put('/edit',async(req,res)=>{

    const {handle,name,avatar,bio,link,inst}=req.bo
    try{
        const edit = await pool.query('UPDATE profiles SET username=$1, img=$2, bio=$3, link=$4, inst_url=$5 ' +
            'WHERE handle=$6 ;',[name,avatar,bio,link,inst,handle])
        res.json(edit.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/follow',async (req,res)=>{

    const {leader,follower} = req.body
    console.log('follow',req.body)
    try{
        const follow = await pool.query('INSERT INTO followers(leader,follower)VALUES($1,$2);',[leader,follower])
        res.json(follow.rows)
    }catch(error){
        console.error(error)
    }
})


app.post('/unfollow',async (req,res)=>{

    const {leader,follower} = req.body
    console.log('unfollow',req.body)
    try{
        const follow = await pool.query('DELETE FROM followers WHERE leader=$1 AND follower = $2;',[leader,follower])
        res.json(follow.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/like',async(req,res)=>{
    const {threadId,userId,recipient}=req.body
    const time=new Date()
    console.log(req.body)

    try{
        const like = await pool.query('INSERT INTO likes(thread_id,user_id)VALUES($1,$2);',[threadId,userId])
        const activity = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,post_id,read_status) VALUES($1,$2,$3,$4,$5,$6)',['like',userId,recipient,time,threadId,'false'])
        res.json({like:like.rows,activity:activity.rows})
    }catch(error){
        console.error(error)
    }
})

app.post('/unlike',async(req,res)=>{
    const {threadId,userId}=req.body
    
    try{
        const dislike = await pool.query('DELETE FROM likes WHERE thread_id=$1 AND user_id=$2;',[threadId,userId])
        res.json(dislike.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/likes',async(req,res)=>{
    const {threadId,userId}=req.body
    try{
        const likes = await pool.query('SELECT COUNT(user_id) FROM likes WHERE thread_id=$1;',[threadId])
        const replies = await pool.query('SELECT COUNT(reply_from) FROM replies WHERE thread_id=$1;',[threadId])
        const checkLike = await pool.query('SELECT * FROM likes WHERE user_id=$1 AND thread_id=$2;',[userId,threadId])
        res.json({replies:replies.rows,likes:likes.rows,isLiked:checkLike.rowCount===1?true:false,endPoint:checkLike.rowCount===1?'unlike':'like'})
        

    }catch(error){
        console.error(error)
    }
})

app.post('/checkfollow',async (req,res)=>{

    const {leader,follower}=req.body

    try{
        const check = await pool.query('SELECT * FROM followers WHERE leader=$1 AND follower=$2;',[leader,follower])
        if(check.rowCount===0){
            res.json({'isFollowed':false,'endPoint':'follow'})
        }else{res.json({'isFollowed':true, 'endPoint':'unfollow'})}

    }catch(error){
        console.error(error)
    }
})
app.post('/reply',async (req,res)=>{
    const {threadId,poster,threadFrom,text,time}=req.body
    const id = uuidv4()
    try{
        const reply = await pool.query('INSERT INTO replies(reply_id,reply_from,reply_to,thread_id,text,timestamp) VALUES($1,$2,$3,$4,$5,$6);',[id,poster,threadFrom,threadId,text,time])
        const post = await pool.query('INSERT INTO threads(id,time_stamp,thread_from,text,reply_to)VALUES($1,$2,$3,$4,$5);',[id,time,poster,text,threadId])
        const activity = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,post_id,read_status) VALUES($1,$2,$3,$4,$5,$6)',['comment',poster,threadFrom,time,threadId,'false'])
        res.json({reply: reply.rows, post: post.rows,activities:activity.rows})
    }catch (error){
        console.error(error)
    }
})

app.post('/activities',async (req,res)=>{
    const {recipient}=req.body
    try{
        const activity = await pool.query('SELECT * FROM activities WHERE recipient_id=$1 AND NOT sender_id=$1;',[recipient])
        res.json(activity.rows)
    }catch(error){
        console.error(error)
    }
})







app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

