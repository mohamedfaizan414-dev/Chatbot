const express = require('express')
const route = express.Router()
const aiController = require('../controllers/ai.controllers')
const authMiddleware = require('../middleware/auth.middleware')

route.use(authMiddleware)
route.post('/summarize', aiController.summarizeNotes)

module.exports = route