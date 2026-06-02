const express = require('express')
const route = express.Router()
const leadController = require('../controllers/lead.controllers')
const authMiddleware = require('../middleware/auth.middleware')

route.use(authMiddleware)
route.post('/create', leadController.createLead)
route.get('/all', leadController.getAllLeads)
route.get('/:id', leadController.getLeadById)
route.patch('/update/:id', leadController.updateLead)
route.delete('/delete/:id', leadController.deleteLead)
route.post('/:id/notes', leadController.addNote)

module.exports = route