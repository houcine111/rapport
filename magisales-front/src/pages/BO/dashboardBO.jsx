import React, { useState,useEffect } from 'react';
import SidebarLayout from '../../layouts/sidebar.jsx';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import  '../../css/stylesframe.css';
import  { decodeToken,getIdentifiant, getRole, getFullname } from '../../components/decodeurtoken.js';

const DashboardBO = () => {
  const token = localStorage.getItem("token");

  const identifiant = getIdentifiant(token);
  const rolefromtoken = getRole(token)
  const [role, setRole] = useState(rolefromtoken ||null);
   const fullnameFromToken = getFullname(token) ;
  const [message, setMessage] = useState("");

  const [users, setUsers] = useState([]);
   const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
const [fullname,setFullname] = useState(fullnameFromToken);



 
useEffect( () => {
  const fetchMessage = async () => {
  try {
    
 
  const response= await fetch(`http://localhost:8005/api/stock_produit/message`);
  if (!response.ok) {
    console.error('Failed to fetch message');
  }
  const data = await response.text();
  setMessage(data);
 } catch (error) {
    console.error('Error fetching message:', error);
  }
};
  fetchMessage();
   const interval = setInterval(fetchMessage,  30000);

    return () => clearInterval(interval); 
},[]);

  return (
    <div className='flex'>
      <div className='fixed left-0 right-0 z-10 '><SidebarLayout /></div>
      
    <div 
      className="relative flex   min-h-screen  flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-wrap justify-between gap-3 p-14 sm:p-10">
              <p className="text-[#111418] tracking-light sm:text-3xl text-xl  font-bold leading-tight min-w-72">
                Tableau de bord <span>{fullname || "Utilisateur"}</span>
              </p>
             
            </div>
     <div className='sm:px-14 ' style={{  width: '100vw',   height:'2000px',  overflow: 'hidden',  border: 'none', position: 'relative' }}
     scrolling="no"
      frameBorder="0"
      allowFullScreen>
  <iframe
  
    src="http://localhost:3000/public/dashboard/27f90a4f-db04-4903-9acc-28a6ce8cdeeb"
    className="   w-full h-full border-none shadow-lg rounded-xl "    title="Metabase Dashboard"
    style={{ width: '100%', height: '100%', border: 'none' }}
  ></iframe>
</div>
      <div className=" flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          

          <div className="flex flex-col flex-1 gap-4  min-w-[200px] max-w-[1200px]">
            
{message && (
  <div className="alert-stock bg-yellow-100 text-yellow-800 p-4 rounded mb-4">
    <strong>Alertes stock :</strong>
    <pre className="whitespace-pre-wrap">{message}</pre>
  </div>
)}
          
          
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardBO;
