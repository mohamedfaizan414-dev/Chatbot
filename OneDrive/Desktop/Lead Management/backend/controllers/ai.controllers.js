const Anthropic = require('@anthropic-ai/sdk')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function summarizeNotes(req, res) {
    try {
        const { notes } = req.body
        if (!notes || notes.length === 0) return res.status(400).json({ message: "No notes to summarize" })

        const notesText = notes.map((n, i) => `${i + 1}. ${n.content}`).join('\n')

        const message = await client.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 512,
            messages: [{
                role: 'user',
                content: `Summarize the following sales lead notes in 3-4 sentences. Focus on key interactions, current status, and next steps:\n\n${notesText}`
            }]
        })

        const summary = message.content[0].text
        res.status(200).json({ summary })
    } catch (err) {
        res.status(500).json({ message: "AI service failed", error: err.message })
    }
}

module.exports = { summarizeNotes }