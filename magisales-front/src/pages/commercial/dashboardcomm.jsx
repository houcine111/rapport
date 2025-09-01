import React, { useState,useEffect } from 'react';
import SidebarLayout from '../../layouts/sidebar.jsx';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import  { getIdentifiant, getRole,getFullname } from '../../components/decodeurtoken.js';

const DashboardComm = () => {
  const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const role = token ? getRole(token) : null;
  const fullnamefrontoken = token ? getFullname(token) : null;

  const [fullname,setFullname] = useState(fullnamefrontoken || "Utilisateur");
  
  
  
  return (
    <div>
        <div className='fixed left-0 top-0 right-0 z-10'><SidebarLayout /></div>
     <div className=" flex  min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="  layout-container flex h-full grow flex-col">
       
        <div className=" flex py-5">
          <div className="layout-content-container flex flex-col min-w-[350px] max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="sm:px-8 text-[#121416] tracking-light pt-5 text-[28px] font-bold leading-tight min-w-72">Table de Bord  <span>{fullname}</span></p>
            </div>
           
              <div className="sm:px-14  " style={{  width: '100vw',   height:'850px',  overflow: 'hidden',  border: 'none', position: 'relative' }}
     scrolling="no"
      frameBorder="0"
      allowFullScreen>
              <iframe
  
              src="http://localhost:3000/public/dashboard/cd8e93ab-16aa-4057-ab7f-b7733ab20929
"
              className=" w-full h-full border-none shadow-lg rounded-xl"    title="Metabase Dashboard"
              style={{ width: '100%', height: '100%', border: 'none' }}
            >
            </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardComm;