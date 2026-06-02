import React, { useState } from 'react'
import api from '../lib/axios'

function Addlead() {
    const [form, setForm] = useState({ name: '', email: '', company: '', status: 'new' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            await api.post('/lead/create', form)
            setSuccess('Lead created successfully')
            setForm({ name: '', email: '', company: '', status: 'new' })
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='p-8'>
            <h2 className='text-white text-3xl font-bold mt-6'>Add Lead</h2>
            <h2 className='text-gray-600 text-xl mb-8'>Create a new lead</h2>
            <div className='bg-side border border-brdr rounded-2xl p-8 max-w-lg'>
                {error && <div className='bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-3 mb-4'>{error}</div>}
                {success && <div className='bg-green-900/30 border border-green-700 text-green-400 rounded-xl p-3 mb-4'>{success}</div>}
                <div className='flex flex-col gap-4'>
                    <div>
                        <label className='text-gray-400 text-sm mb-1 block'>Name *</label>
                        <input name='name' value={form.name} onChange={handleChange} placeholder='John Doe' className='w-full bg-bg border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500' />
                    </div>
                    <div>
                        <label className='text-gray-400 text-sm mb-1 block'>Email *</label>
                        <input name='email' value={form.email} onChange={handleChange} placeholder='john@company.com' className='w-full bg-bg border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500' />
                    </div>
                    <div>
                        <label className='text-gray-400 text-sm mb-1 block'>Company</label>
                        <input name='company' value={form.company} onChange={handleChange} placeholder='Acme Corp' className='w-full bg-bg border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500' />
                    </div>
                    <div>
                        <label className='text-gray-400 text-sm mb-1 block'>Status</label>
                        <select name='status' value={form.status} onChange={handleChange} className='w-full bg-bg border border-brdr text-white rounded-xl p-3 outline-none focus:border-gray-500'>
                            <option value='new'>New</option>
                            <option value='contacted'>Contacted</option>
                            <option value='qualified'>Qualified</option>
                            <option value='closed'>Closed</option>
                        </select>
                    </div>
                    <button onClick={handleSubmit} disabled={loading} className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl p-3 font-semibold mt-2'>
                        {loading ? 'Creating...' : 'Create Lead'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Addlead