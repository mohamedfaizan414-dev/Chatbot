async function health(req, res) {
    try {
        
        res.status(201).json({ message: "Server running"})
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = health