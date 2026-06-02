import React, { useState, useEffect } from 'react'
import '../index.css'
import { IoPeople } from "react-icons/io5"
import { WiStars } from "react-icons/wi"
import { IoMdCheckmark } from "react-icons/io"
import { FaPhoneAlt } from "react-icons/fa"
import api from '../lib/axios'

function Dashboard() {
    const [stats, setStats] = useState({ total: 0, qualified: 0, closed: 0, contacted: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await api.get('/lead/all')
                const leads = res.data.leads
                setStats({
                    total: leads.length,
                    qualified: leads.filter(l => l.status === 'qualified').length,
                    closed: leads.filter(l => l.status === 'closed').length,
                    contacted: leads.filter(l => l.status === 'contacted').length,
                })
            } catch {
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const cards = [
        { label: 'Total Leads', value: stats.total, icon: <IoPeople />, color: 'text-white' },
        { label: 'Qualified', value: stats.qualified, icon: <WiStars />, color: 'text-green-500' },
        { label: 'Closed', value: stats.closed, icon: <IoMdCheckmark />, color: 'text-blue-500' },
        { label: 'Contacted', value: stats.contacted, icon: <FaPhoneAlt />, color: 'text-yellow-500' },
    ]

    return (
        <>
            <div className='flex justify-between p-2 items-center'>
                <div>
                    <h2 className='text-white mt-6 ml-8 text-3xl font-bold'>Dashboard</h2>
                    <h2 className='text-gray-600 ml-8 text-xl'>Your pipeline at a glance</h2>
                </div>
            </div>
            <div className='flex wrap-normal justify-evenly items-center mt-9 font-serif'>
                {cards.map(card => (
                    <div key={card.label} className='w-[17%] h-[11em] bg-side rounded-2xl text-dsh p-3 border border-brdr'>
                        <div className='flex items-center text-2xl justify-center gap-2'>
                            {card.icon}
                            <h2>{card.label}</h2>
                        </div>
                        <h2 className={`${card.color} text-5xl text-start mt-8 ml-3`}>
                            {loading ? '—' : card.value}
                        </h2>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Dashboard