const express = require("express")
const route = express.Router()
const authRoutes = require('../controllers/auth.controllers')

route.post('/login',authRoutes.login)
route.post('/register',authRoutes.register)
route.post('/logout',authRoutes.logout)
module.exports = route