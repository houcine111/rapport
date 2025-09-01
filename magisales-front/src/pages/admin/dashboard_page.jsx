import React, { useState,useEffect } from 'react';
import SidebarLayout from '../../layouts/sidebar.jsx';
import { useNavigate } from 'react-router-dom';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import { set } from 'date-fns';
import  '../../css/stylesframe.css';
import  { decodeToken,getIdentifiant, getRole, getFullname } from '../../components/decodeurtoken.js';
import { id } from 'date-fns/locale';
const DashboardPage = () => {
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
 const [filters, setFilters] = useState({
    region: "",
    
    distributeur: "",
    pos: "",
  });


useEffect(() => {
  const getalluser = async () => {
    try {
      if (!token || !identifiant) {
        console.warn("Token ou identifiant manquant");
        return;
      }

      const response = await fetch(
        `http://localhost:8005/api/users?user=${encodeURIComponent(identifiant)}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        console.error("Status HTTP:", response.status, response.statusText);
        const errorBody = await response.text();
        console.error("Body de la réponse:", errorBody);
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  getalluser();
}, [identifiant, token]);

  const handleFilter = (filters) => {
    let result = [...users];

    if (filters.search) {
      result = result.filter((u) =>
        u.identifiant.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    if (filters.region) {
      result = result.filter((u) => u.region === filters.region);
    }
   
    if (filters.distributeur) {
      result = result.filter((u) => u.distributeur === filters.distributeur);
    }
    if (filters.pos) {
      result = result.filter((u) => u.pos === filters.pos);
    }

    setFilteredUsers(result);
  };
useEffect( () => {
  const fetchMessage = async () => {
  try {
    
 
const response = await fetch(`http://localhost:8005/api/stock_produit/message`, {
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
});  if (!response.ok) {
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
              <button onClick={() => navigate('/dashboard/adduser')}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f0f2f5] text-[#111418] text-sm font-medium leading-normal"
                type="button"
              >
                <span className="truncate">Add User</span>
              </button>
            </div>
     <div className='sm:px-14 ' style={{  width: '100vw',   height:'2000px',  overflow: 'hidden',  border: 'none', position: 'relative' }}
     scrolling="no"
      frameBorder="0"
      allowFullScreen>
  <iframe
  
    src="http://localhost:3000/public/dashboard/5da8c8a2-6826-45f6-a108-eac96dbcb2af"
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
            <h3 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Filters
            </h3>
          
          <SearchAndFilter onFilter={handleFilter}  showdistributeur showregionfilter/>
            <div className=" py-3 overflow-x-auto max-h-[500px] overflow-y-auto">
              <div className="flex min-w-[1000px] w-full overflow-hidden rounded-xl border border-[#dbe0e6] bg-white">
                <table className=" min-w-full">
                  <thead>
                    <tr className="bg-white">
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        identifiant
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        fullname
                      </th>
                      
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Role
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Distributeur
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Region
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Pos
                      </th> 
                       <th className="px-4 py-3 text-left text-[#111418] w-[400px] text-sm font-medium leading-normal">
                        Date
                      </th>
                      {role=== "ADMIN" && (
                        <>
                      <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">
                        Actions
                      </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                              {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-4">
                          Aucun utilisateur trouvé.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user,index) => (
                      <tr key={user.identifiant} className="border-t border-[#dbe0e6]">
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#111418] text-sm font-normal leading-normal">
                          {user.identifiant}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                          {user.fullname}
                        </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                          {user.role || "null"}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                          {user.distributeur || "null"}
                        </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                          {user.region || "null"}
                        </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                          {user.pos || "null"}
                        </td> 
                            <td className="h-[72px] px-4 py-2 w-[200px] text-[#0a0a0a] text-sm font-normal leading-normal">
                              {new Date(user.date).toLocaleString()}
                            </td>
                             {role=== "ADMIN" && (
                        <>

                                          <td className="h-[72px] px-4 py-2 w-[150px] text-sm font-normal leading-normal">
                          <button
                            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 ${
                              user.active ? 'bg-[#f0f2f5] text-[#111418]' : 'bg-red-100 text-red-700'
                            } text-sm font-medium leading-normal w-full`}
                            type="button"
                          >
                            <span className="truncate">{user.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                        <td  onClick={() => navigate(`/dashboard/${user.id}/modifier_user`)} 
                        className="h-[72px] px-4 py-2 w-60 text-[#60758a] text-sm font-bold leading-normal tracking-[0.015em] cursor-pointer">
                         Edit
                        </td>
                        </>
                              )}
                      </tr>
                    ))
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default DashboardPage;
