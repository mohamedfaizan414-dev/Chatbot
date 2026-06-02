
const dns = require('node:dns');
dns.setServers(['1.1.1.1', '8.8.8.8']); 
const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const cors = require('cors')
const cookieparser = require('cookie-parser')
const connectDB = require('./lib/db')
const authRoutes = require("./routes/auth.route")
const leadRoutes = require('./routes/lead.routes')
const aiRoutes = require('./routes/ai.routes')
const healthRoute = require('./routes/healthRoute')

connectDB()
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true                
}));
app.use(cookieparser())
app.use(express.json())
app.use('/api/auth',authRoutes);
app.use('/api/lead',leadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/check',healthRoute)

app.listen(process.env.PORT,()=>{
    console.log('Server Started')
})