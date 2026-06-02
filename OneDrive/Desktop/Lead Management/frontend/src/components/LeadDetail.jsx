import React, { useState, useEffect } from 'react'
import api from '../lib/axios'
import { IoArrowBack } from 'react-icons/io5'
import { WiStars } from 'react-icons/wi'

const statusColors = {
    new: 'bg-blue-900/40 text-blue-400 border-blue-700',
    contacted: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
    qualified: 'bg-green-900/40 text-green-400 border-green-700',
    closed: 'bg-gray-800 text-gray-400 border-gray-600'
}

function LeadDetail({ leadId, onBack }) {
    const [lead, setLead] = useState(null)
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [noteInput, setNoteInput] = useState('')
    const [noteLoading, setNoteLoading] = useState(false)
    const [editStatus, setEditStatus] = useState('')
    const [aiLoading, setAiLoading] = useState(false)
    const [aiDraft, setAiDraft] = useState('')
    const [aiError, setAiError] = useState('')
    const [savedSummary, setSavedSummary] = useState('')

    async function fetchLead() {
        try {
            const res = await api.get(`/lead/${leadId}`)
            setLead(res.data.lead)
            setNotes(res.data.notes)
            setEditStatus(res.data.lead.status)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLead()
    }, [leadId])

    async function handleAddNote(e) {
        e.preventDefault()
        if (!noteInput.trim()) return
        setNoteLoading(true)
        try {
            await api.post(`/lead/${leadId}/notes`, { content: noteInput })
            setNoteInput('')
            fetchLead()
        } catch {
        } finally {
            setNoteLoading(false)
        }
    }

    async function handleStatusChange(e) {
        const newStatus = e.target.value
        setEditStatus(newStatus)
        await api.patch(`/lead/update/${leadId}`, { status: newStatus })
        fetchLead()
    }

    async function handleGenerateSummary() {
        if (notes.length === 0) return
        setAiLoading(true)
        setAiError('')
        setAiDraft('')
        try {
            const res = await api.post('/ai/summarize', { notes })
            setAiDraft(res.data.summary)
        } catch (err) {
            setAiError(err.response?.data?.message || 'AI service failed. Try again.')
        } finally {
            setAiLoading(false)
        }
    }

    function handleSaveSummary() {
        setSavedSummary(aiDraft)
        setAiDraft('')
    }

    if (loading) return <div className='text-gray-500 text-center mt-20'>Loading...</div>
    if (!lead) return <div className='text-red-400 text-center mt-20'>Lead not found.</div>

    return (
        <div className='p-8 overflow-y-auto h-full'>
            <button onClick={onBack} className='flex items-center gap-2 text-gray-400 hover:text-white mb-6'>
                <IoArrowBack /> Back to Leads
            </button>
            <div className='flex justify-between items-start mb-8'>
                <div>
                    <h2 className='text-white text-3xl font-bold'>{lead.name}</h2>
                    <p className='text-gray-500 mt-1'>{lead.email} {lead.company && `· ${lead.company}`}</p>
                    <p className='text-gray-600 text-sm mt-1'>Added {new Date(lead.createdAt).toLocaleDateString()}</p>
                </div>
                <select value={editStatus} onChange={handleStatusChange} className={`text-sm px-4 py-2 rounded-full border outline-none cursor-pointer bg-transparent ${statusColors[editStatus]}`}>
                    <option value='new'>New</option>
                    <option value='contacted'>Contacted</option>
                    <option value='qualified'>Qualified</option>
                    <option value='closed'>Closed</option>
                </select>
            </div>

            <div className='bg-side border border-brdr rounded-2xl p-6 mb-6'>
                <div className='flex justify-between items-center mb-4'>
                    <h3 className='text-white font-semibold text-lg'>Notes</h3>
                    <button onClick={handleGenerateSummary} disabled={aiLoading || notes.length === 0} className='flex items-center gap-2 bg-purple-900/40 border border-purple-700 text-purple-400 hover:bg-purple-900/60 disabled:opacity-40 rounded-xl px-4 py-2 text-sm'>
                        <WiStars size={18} />
                        {aiLoading ? 'Generating...' : 'AI Summary'}
                    </button>
                </div>

                {aiError && <div className='bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-3 mb-4 text-sm'>{aiError}</div>}

                {aiDraft && (
                    <div className='bg-purple-900/20 border border-purple-700/50 rounded-xl p-4 mb-4'>
                        <p className='text-purple-300 text-sm font-medium mb-2'>AI Draft — Review before saving</p>
                        <textarea value={aiDraft} onChange={e => setAiDraft(e.target.value)} className='w-full bg-transparent text-gray-300 text-sm outline-none resize-none min-h-[80px]' />
                        <div className='flex gap-2 mt-3'>
                            <button onClick={handleSaveSummary} className='bg-purple-700 hover:bg-purple-600 text-white rounded-lg px-4 py-1.5 text-sm'>Save Summary</button>
                            <button onClick={() => setAiDraft('')} className='text-gray-500 hover:text-gray-300 text-sm px-3'>Discard</button>
                        </div>
                    </div>
                )}

                {savedSummary && (
                    <div className='bg-gray-800/50 border border-brdr rounded-xl p-4 mb-4'>
                        <p className='text-gray-500 text-xs mb-1'>Saved AI Summary</p>
                        <p className='text-gray-300 text-sm'>{savedSummary}</p>
                    </div>
                )}

                {notes.length === 0 && !aiDraft && (
                    <p className='text-gray-600 text-sm mb-4'>No notes yet. Add your first note below.</p>
                )}

                <div className='flex flex-col gap-3 mb-4'>
                    {notes.map(note => (
                        <div key={note._id} className='bg-bg border border-brdr rounded-xl p-4'>
                            <p className='text-gray-300 text-sm'>{note.content}</p>
                            <p className='text-gray-600 text-xs mt-2'>{new Date(note.createdAt).toLocaleString()}</p>
                        </div>
                    ))}
                </div>

                <div className='flex gap-3'>
                    <input value={noteInput} onChange={e => setNoteInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddNote(e)} placeholder='Add a note...' className='flex-1 bg-bg border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500 text-sm' />
                    <button onClick={handleAddNote} disabled={noteLoading || !noteInput.trim()} className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-5 text-sm font-medium'>
                        {noteLoading ? '...' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LeadDetail