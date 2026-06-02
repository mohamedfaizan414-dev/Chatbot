const express = require("express")
const route = express.Router()
const healthRoutes = require('../controllers/health.controllers')

route.post('/',healthRoutes)

module.exports = route