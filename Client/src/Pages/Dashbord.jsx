import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../Components/DashProfile'
import DashSidebar from '../Components/DashSidebar'


const Dashbord = () => {
  const location = useLocation()
  const [tab, setTab] = useState("")
  useEffect(() => {
    const urlparams = new URLSearchParams(location.search) 
    const tabFromUrl = urlparams.get("tab")
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }  
    
  },[location.search])
  
  return (
    <div className="d-flex flex-column flex-md-row mb-2" style={{ height: "100vh" }}>
      <div>
        <DashSidebar />
      </div>
      <DashProfile />
    </div>
  );
}

export default Dashbord