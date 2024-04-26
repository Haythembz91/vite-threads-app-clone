const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const pool = require('./db')

app.get('/users',async (req,res)=>{


    try{
        const users = await pool.query('SELECT * FROM users;')
        res.json(users.rows)
    }catch(err){console.error(err)}

});













app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

