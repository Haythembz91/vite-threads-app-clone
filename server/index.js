const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`))

