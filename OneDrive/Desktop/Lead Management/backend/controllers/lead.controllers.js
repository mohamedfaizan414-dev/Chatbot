const leadModel = require('../models/lead.schema')
const noteModel = require('../models/note.schema')

async function createLead(req, res) {
    try {
        const { name, email, company, status } = req.body
        if (!name || !email) return res.status(400).json({ message: "Name and email are required" })
        const lead = await leadModel.create({ name, email, company, status })
        res.status(201).json({ message: "Lead created", lead })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getAllLeads(req, res) {
    try {
        const { search, status } = req.query
        const query = {}
        if (status) query.status = status
        if (search) query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ]
        const leads = await leadModel.find(query).sort({ createdAt: -1 })
        res.status(200).json({ leads })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getLeadById(req, res) {
    try {
        const lead = await leadModel.findById(req.params.id)
        if (!lead) return res.status(404).json({ message: "Lead not found" })
        const notes = await noteModel.find({ leadId: req.params.id }).sort({ createdAt: 1 })
        res.status(200).json({ lead, notes })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function updateLead(req, res) {
    try {
        const update = await leadModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
        if (!update) return res.status(404).json({ message: "Lead not found" })
        res.status(200).json({ message: "Lead updated", lead: update })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function deleteLead(req, res) {
    try {
        const del = await leadModel.findByIdAndDelete(req.params.id)
        if (!del) return res.status(404).json({ message: "Lead not found" })
        await noteModel.deleteMany({ leadId: req.params.id })
        res.status(200).json({ message: "Lead deleted" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function addNote(req, res) {
    try {
        const { content } = req.body
        if (!content) return res.status(400).json({ message: "Note content is required" })
        const lead = await leadModel.findById(req.params.id)
        if (!lead) return res.status(404).json({ message: "Lead not found" })
        const note = await noteModel.create({ leadId: req.params.id, content })
        res.status(201).json({ message: "Note added", note })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { createLead, getAllLeads, getLeadById, updateLead, deleteLead, addNote }