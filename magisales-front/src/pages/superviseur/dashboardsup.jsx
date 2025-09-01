import SidebarLayout from '../../layouts/sidebar.jsx';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  { getIdentifiant, getRole ,getFullname} from '../../components/decodeurtoken.js';

const DashboardSup = () => {

  const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const role = token ? getRole(token) : null;
  const fullnamefrontoken = token ? getFullname(token) : null;

  const [fullname,setFullname] = useState(fullnamefrontoken || "Utilisateur");

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate();
   useEffect(() => {
  const getalluser= async () => {
    try {
      const response = await fetch(`http://localhost:8005/api/users?user=${encodeURIComponent(identifiant)}`);
      const data = await response.json();
      console.log(data);
      setUsers(data );
      setFilteredUsers(data); 
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
    getalluser();
    }, []);
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
  return (
    <div>
        <div className='fixed left-0 z-10 top-0 right-0'><SidebarLayout /></div>
            <div className="relative flex  min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}>
    
      <div className=" layout-container flex h-full grow flex-col">
      
        <div className=" pt-10 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col min-w-[350px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Tableau de bord <span>{fullname}</span></p>
            </div>
            <div className="p-14 " style={{  width: '100vw',   height:'700px',  overflow: 'hidden',  border: 'none', position: 'relative' }}
     scrolling="no"
      frameBorder="0"
      allowFullScreen>
              <iframe
  
              src="http://localhost:3000/public/dashboard/d619b6b6-e90f-40d1-8432-d5422e200ff8
"
              className=" w-full h-full border-none shadow-lg rounded-xl"    title="Metabase Dashboard"
              style={{ width: '100%', height: '100%', border: 'none' }}
            >
            </iframe>
            </div>

            <div className="p-5">
            <h3 className='text-2xl font-bold p-4'>Filtres</h3>
            <SearchAndFilter onFilter={handleFilter}  showdistributeur/>
            <div className="p-4 py-3 overflow-x-auto max-h-[500px] overflow-y-auto">
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
                      <th className="px-4 py-3 text-left text-[#111418] w-60 text-sm font-medium leading-normal">
                        Status
                      </th>
                     
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
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                          {user.fullname}
                        </td>
                        <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                          {user.distributeur || "null"}
                        </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                          {user.region || "null"}
                        </td>
                          <td className="h-[72px] px-4 py-2 w-[400px] text-[#60758a] text-sm font-normal leading-normal">
                          {user.pos || "null"}
                        </td> 
                            <td className="h-[72px] px-4 py-2 w-[200px] text-[#60758a] text-sm font-normal leading-normal">
                              {new Date(user.date).toLocaleString()}
                            </td>

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
    </div>
  );
};

export default DashboardSup;