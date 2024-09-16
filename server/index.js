require('dotenv').config()
const PORT = process.env.SERVER_PORT
const express = require('express')
const cors = require('cors')
const app = express()
app.use(express.json())
const pool = require('./db')
const jwt = require('jsonwebtoken')
const {v4:uuidv4} = require ('uuid')
const bcrypt = require('bcrypt')

app.use(cors(
    {origin:"https://vite-threads-app-clone-1.onrender.com"}
))


// get all users & threads

app.post('/users',async (req,res)=>{
    const {handle}=req.body
    try{
        const users = await pool.query('SELECT p.*,COUNT(f.follower) AS follower_count,\n' +
            'CASE\n' +
            'WHEN e.follower=$1 THEN TRUE\n' +
            'ELSE FALSE\n' +
            'END AS isfollowed\n' +
            'FROM profiles p\n' +
            'LEFT JOIN followers f ON p.handle=f.leader \n' +
            'LEFT JOIN followers e ON e.leader=f.leader AND e.follower=$1\n' +
            'GROUP BY p.handle,p.id,e.follower ORDER BY p.handle;',[handle])
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
    const {thread_id,user}=req.body
    try{
        const replies = await pool.query('WITH RECURSIVE ancestors(id,reply_to) AS (SELECT id,reply_to FROM threads  WHERE id=$1 AND thread_from=$2 UNION ALL SELECT t.id,t.reply_to FROM threads t INNER JOIN ancestors a ON  t.id=a.reply_to) SELECT t.id,t.thread_from,t.time_stamp,t.text,t.reply_to FROM threads t INNER JOIN ancestors a ON a.id=t.id AND (a.reply_to=t.reply_to OR a.reply_to IS NULL);',[thread_id,user])
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

app.put('/editpost',async(req,res)=>{
    const {text,thread_id}=req.body
    try{
        const editPost = await pool.query('UPDATE threads SET text=$1 WHERE id=$2;',[text,thread_id])
        res.json(editPost.rows)
    }catch (error){
        console.log(error)
    }
})

app.put('/edit',async(req,res)=>{

    const {handle,name,avatar,bio,link,inst}=req.body
    try{
        const edit = await pool.query('UPDATE profiles SET username=$1, img=$2, bio=$3, link=$4, inst_url=$5 ' +
            'WHERE handle=$6 ;',[name,avatar,bio,link,inst,handle])
        res.json(edit.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/follow',async (req,res)=>{

    const {leader,follower,filter} = req.body
    const time=new Date()
    try{
        const follow = await pool.query('INSERT INTO followers(leader,follower)VALUES($1,$2);',[leader,follower])
        const activity = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,read_status,filter) VALUES($1,$2,$3,$4,$5,$6)',['follow',follower,leader,time,'false',filter])
        res.json({follow:follow.rows, activity:activity.rows})
    }catch(error){
        console.error(error)
    }
})


app.post('/unfollow',async (req,res)=>{

    const {leader,follower} = req.body
    try{
        const follow = await pool.query('DELETE FROM followers WHERE leader=$1 AND follower = $2;',[leader,follower])
        res.json(follow.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/like',async(req,res)=>{
    const {threadId,userId,recipient,filter}=req.body
    const time=new Date()

    try{
        const like = await pool.query('INSERT INTO likes(thread_id,user_id)VALUES($1,$2);',[threadId,userId])
        const activity = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,post_id,read_status,filter) VALUES($1,$2,$3,$4,$5,$6,$7)',['like',userId,recipient,time,threadId,'false',filter])
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
    const {threadId,userId,poster}=req.body
    try{
        const likes = await pool.query('SELECT COUNT(user_id) FROM likes WHERE thread_id=$1;',[threadId])
        const replies = await pool.query('SELECT COUNT(thread_from) FROM threads WHERE reply_to=$1;',[threadId])
        const repost = await pool.query('SELECT COUNT(user_id) FROM reposts WHERE thread_id=$1;',[threadId])
        const checkLike = await pool.query('SELECT * FROM likes WHERE user_id=$1 AND thread_id=$2;',[userId,threadId])
        const checkSave = await pool.query('SELECT * FROM activities WHERE notification_type=$1 AND sender_id=$2 AND recipient_id=$3 AND post_id=$4',['save',poster,userId,threadId] )
        const isReposted = await pool.query('SELECT COUNT(user_id) AS repost_count FROM reposts WHERE thread_id=$1 AND user_id=$2',[threadId,userId])
        res.json({reposts:repost.rows[0].count,isReposted:isReposted.rows[0].repost_count!=='0',isSaved:checkSave.rowCount===1,replies:replies.rows,likes:likes.rows,isLiked:checkLike.rowCount===1,endPoint:checkLike.rowCount===1?'unlike':'like'})

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
        const post = await pool.query('INSERT INTO threads(id,time_stamp,thread_from,text,reply_to)VALUES($1,$2,$3,$4,$5);',[id,time,poster,text,threadId])
        const activity = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,post_id,read_status,filter) VALUES($1,$2,$3,$4,$5,$6,$7)',['comment',poster,threadFrom,time,threadId,'false','threads'])
        res.json({'post':post.rows, 'activity':activity.rows})
    }catch (error){
        console.error(error);
    }
})

app.post('/activities',async (req,res)=>{
    const {recipient}=req.body
    try{
        const activity = await pool.query('SELECT a.* FROM activities a WHERE recipient_id=$1 AND NOT sender_id=$1 ORDER BY a.timestamp ;',[recipient])
        res.json(activity.rows)
    }catch(error){
        console.error(error)
    }
})

app.delete('/delete',async(req,res)=>{
    const {thread_id}=req.body
    try{
        const deleteRepost = await pool.query('DELETE FROM reposts WHERE thread_id=$1;',[thread_id])
        const deletePost = await pool.query('DELETE FROM threads WHERE id=$1;',[thread_id])
        const deleteLike = await pool.query('DELETE FROM likes WHERE thread_id=$1;',[thread_id])
        res.json(deletePost.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/save',async(req,res)=>{

    const {threadId,poster,threadFrom,time,filter}=req.body

    try{
        const save = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,post_id,read_status,filter)VALUES($1,$2,$3,$4,$5,$6,$7);',['save',threadFrom,poster,time,threadId,false,filter])
        res.json(save.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/unsave',async(req,res)=>{

    const {threadId,poster,threadFrom,filter}=req.body

    try{
        const unsave = await pool.query('DELETE FROM activities WHERE notification_type=$1 AND sender_id=$2 AND recipient_id=$3 AND post_id=$4 AND filter=$5;',['save',threadFrom,poster,threadId,filter])
        res.json(unsave.rows)
    }catch(error){
        console.error(error)
    }
})

app.post('/repost',async(req,res)=>{
    const {thread_id,poster_id,user_id}=req.body

    try{
        const repost = await pool.query('INSERT INTO reposts(thread_id,poster_id,user_id) VALUES($1,$2,$3)',[thread_id,poster_id,user_id])
        const activity = await pool.query('INSERT INTO activities(notification_type,sender_id,recipient_id,timestamp,post_id,read_status,filter)VALUES($1,$2,$3,$4,$5,$6,$7);',['repost',user_id,poster_id,new Date(),thread_id,false,'threads'])
        res.json(repost.rows)
    }catch(e){
        console.error(e)
    }
})

app.post('/removerepost',async(req,res)=>{
    const {thread_id,user_id,poster_id}=req.body

    try{
        const removerepost = await pool.query('DELETE FROM reposts WHERE thread_id=$1 AND user_id=$2',[thread_id,user_id])
        const activity = await pool.query('DELETE FROM activities WHERE notification_type=$1 AND sender_id=$2 AND recipient_id=$3 AND post_id=$4 AND filter=$5 ;',['repost',user_id,poster_id,thread_id,'threads'])
        res.json(removerepost.rows)
    }catch(e){
        console.error(e)
    }
})

app.post('/reposts',async(req,res)=>{
    const {user_id,follower}=req.body
    try{
        if(user_id!==follower){
            const reposts = await pool.query('SELECT t.*,r.user_id,f.follower FROM \n' +
                'threads t JOIN reposts r ON \n' +
                't.id=r.thread_id AND user_id=$1 \n' +
                'JOIN followers f ON f.leader=$1 AND f.follower=$2;',[user_id,follower])
            res.json(reposts.rows)
        }
        else{
            const reposts = await pool.query('SELECT t.*,r.user_id FROM threads t JOIN reposts r \n' +
                'ON t.id=r.thread_id AND r.user_id=$1;',[user_id])
            res.json(reposts.rows)
        }
    }catch(e){
        console.error(e)
    }

})

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

