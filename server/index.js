const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const pool = require('./db')

app.get('/:handle',async (req,res)=>{

    const {handle} = req.params
    try{
        const users = await pool.query('SELECT * FROM profiles WHERE handle=$1;',[handle])
        const followers = await pool.query('SELECT COUNT(follower) FROM followers WHERE leader=$1;',[handle])
        res.json({users:users.rows,followers:followers.rows})
    }catch(err){console.error(err)}

});













app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

