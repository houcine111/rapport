import SidebarLayout from '../../layouts/sidebar.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import { useState, useEffect } from 'react';
import  { getIdentifiant, getRole } from '../../components/decodeurtoken.js';

const Declarations = () => {
  const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const rolefromtoken = token ? getRole(token) : null;
  const [declarations, setDeclarations] = useState([]);
  const [filteredDeclarations, setFilteredDeclarations] = useState([]);
const [loadingId, setLoadingId] = useState(null);
     const [role, setRole] = useState(rolefromtoken || null);
     const navigate = useNavigate();
 
  useEffect(() => {
  if (identifiant) {
    axios.get(`http://localhost:8005/api/getdeclarations?identifiant=${identifiant}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })
      .then(res => {
        setDeclarations(res.data);
        setFilteredDeclarations(res.data);
        //console.log("Declarations:", res.data);
      })
      .catch(err => console.error('Erreur lors de la récupération des déclarations', err));
  }
}, []);
const handleStatusChange = (id, newStatus) => {
   const confirmChange = window.confirm(
    `Voulez-vous vraiment changer le statut en "${newStatus}" ?`
  );
  if (!confirmChange) return;
  setLoadingId(id);
  axios.put(`http://localhost:8005/api/updateStatus/${id}?statut=${newStatus}`, {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
    .then(() => {
      setDeclarations(prev => 
        prev.map(dec => dec.id === id ? {...dec, statut: newStatus} : dec)
      );
    })
    .catch(err => console.error('Erreur update statut', err))
    .finally(() => setLoadingId(null));
};
 const handleFilter = (filters) => {
    let result = [...declarations];

    if (filters.search) {
        const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      result = result.filter((u) =>
        (u.stocknom && normalize(u.stocknom).includes(normalize(filters.search))) ||
        (u.posnom && normalize(u.posnom).includes(normalize(filters.search)))
      );
    }
    if (filters.region) {
      result = result.filter((u) => u.regionnom === filters.region);
    }
     if(filters.startDate && filters.endDate) {
          result = result.filter((u) =>{
            const date = new Date(u.updatedAt);
            return(
              date >= new Date(filters.startDate) &&
              date <= new Date(filters.endDate)
            );
         } );
        }
   
   
   

    setFilteredDeclarations(result);
  };
  const changecolorstatus = (statut) => {
    switch (statut) {
      case "Valide":
        return "bg-green-100 text-green-800";
      case "Rejete":
        return "bg-red-100 text-red-800";
      case "Attente":
        return "bg-yellow-100 text-yellow-800";
    }
  }

  return (
    <div>
      <div className='fixed left-0 top-0 right-0 z-10'><SidebarLayout /></div>
      <div className="relative flex  min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}   >

      <div className="sm:p-8 layout-container flex h-full grow flex-col">
       
        <div className="px-20 flex  flex-1 justify-center py-5">
          <div className=" layout-content-container flex flex-col min-w-[350px]">
            <div className="flex flex-wrap justify-between gap-3 p-4 ">
              <div className="flex min-w-72 flex-col gap-3 pt-4">
                <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight">Declarations</p>
               
              </div>
              
                {(role==="ADMIN" || role==="SUPERVISEUR") && (
              <button  onClick={()=>navigate("/dashboard/ajouter_declarations")}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-medium leading-normal"
              >
                    <span className="truncate">Ajouter une Declaration</span>
              </button>
              )}
            </div>
           
                          <div className='p-5'><SearchAndFilter  onFilter={handleFilter} showregionfilter  showdatefilter/> </div>

            <div className=" py-3 overflow-x-auto  max-h-[700px] overflow-y-auto">
              <div className="flex  overflow-x-auto min-w-[1000px] sm:w-[850px]  rounded-xl border border-[#dde0e3] bg-white">
                <table className="w-full table-auto ">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Type</th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Submitted By
                      </th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-360 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Région</th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Stock</th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-600 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Note</th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-720 px-4 py-3 text-left text-[#121416] w-60 text-sm font-medium leading-normal">Statut</th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-840 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Date</th>
                      <th className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-960 px-4 py-3 text-left  w-60 text-[#6a7581] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDeclarations.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-4">
                        Aucun stock trouvé.
                      </td>
                    </tr>
                    ) : (
                     filteredDeclarations.map((dec, index) => (
                    <tr key={index} className="border-t border-t-[#dde0e3]">
                      <td className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-120 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">{dec.type}</td>
                      <td className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-240 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
                        {dec.identifiant}
                      </td>
                      
                        
                        <td className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
                        {dec.region}
                      </td>
                      <td className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-480 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
                        {dec.stocknom}
                      </td>
                      <td
                          className="truncate cursor-pointer table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-600
                                    h-[72px] px-4 py-2 w-[80px] text-[#6a7581] text-sm font-normal leading-normal"
                          title={dec.note}
                        >
                          {dec.note}
                        </td>

                      <td className="px-4 py-2">
                        {role === "ADMIN" ? (
                          <select
                            value={dec.statut}
                            onChange={(e) => handleStatusChange(dec.id, e.target.value)} 
                            disabled={loadingId === dec.id  || dec.statut === "Valide" || dec.statut === "Rejete"}
                            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center 
                                      overflow-hidden rounded-full h-8 px-4 bg-[#f1f2f4] 
                                      text-[#121416] text-sm font-medium leading-normal w-full ${changecolorstatus(dec.statut)}`}
                          >
                            <option value="Attente">Attente</option>
                            <option value="Valide">Valide</option>
                            <option value="Rejete">Rejete</option>
                          </select>
                        ) : (
                          <button
                            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center 
                                      overflow-hidden rounded-full h-8 px-4 bg-[#f1f2f4] 
                                      text-[#121416] text-sm font-medium leading-normal w-full ${changecolorstatus(dec.statut)}`}
                          >
                            {dec.statut}
                          </button>
                       )}
                      </td>


                      <td className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-840 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
                        {dec.updatedAt||"-"}
                      </td>
                      <td className="table-5cf789e6-255a-44a3-8171-4f4cdbdac6df-column-960 h-[72px] px-4 py-2 w-60 text-[#6a7581] text-sm font-bold leading-normal tracking-[0.015em]">
                       <span >Modifier </span>
                       
                      </td>
                    </tr>
                   
    )))}
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
export default Declarations;
