import React, { useState, useEffect } from 'react'
import api from '../lib/axios'
import LeadDetail from './LeadDetail'

const statusColors = {
    new: 'bg-blue-900/40 text-blue-400 border-blue-700',
    contacted: 'bg-yellow-900/40 text-yellow-400 border-yellow-700',
    qualified: 'bg-green-900/40 text-green-400 border-green-700',
    closed: 'bg-gray-800 text-gray-400 border-gray-600'
}

function Lead() {
    const [leads, setLeads] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [selectedLead, setSelectedLead] = useState(null)

    async function fetchLeads() {
        setLoading(true)
        try {
            const params = {}
            if (search) params.search = search
            if (statusFilter) params.status = statusFilter
            const res = await api.get('/lead/all', { params })
            setLeads(res.data.leads)
        } catch (err) {
            setError('Failed to load leads')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [search, statusFilter])

    if (selectedLead) return <LeadDetail leadId={selectedLead} onBack={() => { setSelectedLead(null); fetchLeads() }} />

    return (
        <div className='p-8'>
            <div className='flex justify-between items-center mt-6 mb-2'>
                <div>
                    <h2 className='text-white text-3xl font-bold'>Leads</h2>
                    <h2 className='text-gray-600 text-xl'>Manage your pipeline</h2>
                </div>
            </div>
            <div className='flex gap-3 mb-6 mt-6'>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search by name or email...' className='bg-side border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500 w-72' />
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className='bg-side border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500'>
                    <option value=''>All Status</option>
                    <option value='new'>New</option>
                    <option value='contacted'>Contacted</option>
                    <option value='qualified'>Qualified</option>
                    <option value='closed'>Closed</option>
                </select>
            </div>
            {loading && <div className='text-gray-500 text-center mt-20'>Loading leads...</div>}
            {error && <div className='text-red-400 text-center mt-20'>{error}</div>}
            {!loading && !error && leads.length === 0 && (
                <div className='text-gray-500 text-center mt-20'>No leads found. Add your first lead.</div>
            )}
            {!loading && !error && leads.length > 0 && (
                <div className='bg-side border border-brdr rounded-2xl overflow-hidden'>
                    <table className='w-full'>
                        <thead>
                            <tr className='border-b border-brdr'>
                                <th className='text-left text-gray-500 p-4 font-medium'>Name</th>
                                <th className='text-left text-gray-500 p-4 font-medium'>Email</th>
                                <th className='text-left text-gray-500 p-4 font-medium'>Company</th>
                                <th className='text-left text-gray-500 p-4 font-medium'>Status</th>
                                <th className='text-left text-gray-500 p-4 font-medium'>Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map(lead => (
                                <tr key={lead._id} onClick={() => setSelectedLead(lead._id)} className='border-b border-brdr hover:bg-gray-800/30 cursor-pointer'>
                                    <td className='p-4 text-white font-medium'>{lead.name}</td>
                                    <td className='p-4 text-gray-400'>{lead.email}</td>
                                    <td className='p-4 text-gray-400'>{lead.company || '—'}</td>
                                    <td className='p-4'>
                                        <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[lead.status]}`}>
                                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className='p-4 text-gray-400'>{new Date(lead.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default Lead