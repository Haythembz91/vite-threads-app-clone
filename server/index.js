const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const pool = require('./db')

// get profiles

app.get('/users/:handle',async (req,res)=>{

    const {handle} = req.params
    try{
        const users = await pool.query('SELECT * FROM profiles WHERE handle=$1;',[handle])
        const followers = await pool.query('SELECT COUNT(follower) FROM followers WHERE leader=$1;',[handle])
        res.json({users:users.rows,followers:followers.rows})
    }catch(err){console.error(err)}

});

// get threads

app.get('/:handle/threads',async(req,res)=>{
        const {handle}=req.params
    try{
        const threads = await pool.query('SELECT * FROM threads WHERE thread_from=$1;',[handle])
        res.json(threads.rows)
    }catch(err){console.error(err)}
})

// get all users & threads

app.get('/users',async (req,res)=>{


    try{
        const users = await pool.query('SELECT * FROM profiles;')
        res.json(users.rows)
    }catch(err){console.error(err)}

});

// get threads

app.get('/threads',async(req,res)=>{

    try{
        const threads = await pool.query('SELECT * FROM threads;')
        res.json(threads.rows)
    }catch(err){console.error(err)}
})










app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

