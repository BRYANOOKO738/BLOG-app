import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashProfile from '../Components/DashProfile'
import DashSidebar from '../Components/DashSidebar'
import Dashpost from '../Components/Dashpost'
import Dashusers from '../Components/Dashusers'
import DashComents from '../Components/DashComents'
import DasboardAdmin from '../Components/DasboardAdmin'
import DashSubscribers from '../Components/DashSubscribers'



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
    <div
      className="d-flex flex-column flex-md-row mb-2"
      style={{ height: "100vh" }}
    >
      <div style={{ width: "250px" }}>
        <DashSidebar />
      </div>
      <div
        className="d-flex justify-content-center align-items-center dash-profile-container"
        style={{ flex: 1, transform: "translateY(-20px)" }} // Adjust the value to suit your needs
      >
        {tab === "profile" && <DashProfile />}
      </div>
      {tab === "post" && <Dashpost />}
      {tab === "users" && <Dashusers />}
      {tab === "comments" && <DashComents />}
      {tab === "dashSubscribers" && <DashSubscribers />}
      {tab === "dasboardAdmin" && <DasboardAdmin />}
    </div>
  );
}

export default Dashbord