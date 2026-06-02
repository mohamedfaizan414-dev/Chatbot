import React, { useState } from 'react'
import './index.css'
import { PiCodaLogoBold } from "react-icons/pi";
import { MdOutlineDashboard } from "react-icons/md";
import { CiCirclePlus } from "react-icons/ci";
import { IoPeople } from "react-icons/io5";
import Dashboard from './components/Dashboard';
import Addlead from './components/Addlead';
import Lead from './components/Lead';

function App() {
  const [pages,setPage] = useState('dashboard')
const page = {
  dashboard:<Dashboard/>,
  lead:<Lead/>,
  add:<Addlead/>

}


  return (
    
    <div className='flex  w-scren h-screen'>
      <div className='bg-side w-[24%] border border-brdr shadow-2xl'>
        <div className='p-3 border-b border-brdr h-[5em] text-white flex items-center gap-1'>
      <PiCodaLogoBold color=' blue'  size={46}/>
      <div>
         <h2 className='text-xl '>LeadFlow</h2> 
         <h2 className='text-xs'>Sales CRM</h2>
         </div>
        </div>
        <div className='text-txt pt-5  ml-2'>
        <h2 className='font-bold'>MAIN</h2>
        <div>
          <div className='mt-3 ml-3 mb-2 '>
          <div className={pages==='dashboard'?'flex gap-1 items-center bg-gray-800 text-white p-2 w-[90%] rounded-2xl mb-2':'flex gap-1 items-center mb-2 hover:bg-gray-800 hover:text-white p-2 w-[90%] rounded-2xl'} onClick={()=>{setPage('dashboard')}}>
            <MdOutlineDashboard/>
            <h2>Dashboard</h2>
          </div>
          <div className={pages==='lead'?'flex gap-1 items-center bg-gray-800 text-white p-2 w-[90%] rounded-2xl mb-2':'flex gap-1 items-center mb-2 hover:bg-gray-800 hover:text-white p-2 w-[90%] rounded-2xl'} onClick={()=>{setPage('lead')}}>
            <IoPeople/>
    <h2>Leads</h2>


          </div>
          </div>

          <h2 className='font-bold'>TOOLS</h2>
      
          <div className={pages==='add'?'flex gap-1 items-center mt-3 ml-3 mb-2  bg-gray-800 text-white p-2 w-[90%] rounded-2xl':'flex gap-1 items-center mt-3 ml-3 mb-2   hover:bg-gray-800 hover:text-white p-2 w-[90%] rounded-2xl'} onClick={()=>{setPage('add')}}>
            <CiCirclePlus/>
            <h2>Add lead</h2>
          </div>

        </div>

        </div>
      </div>
      <div className='bg-bg w-full h-full'>
        {page[pages]}
      </div>
    </div>
  )
}

export default App
