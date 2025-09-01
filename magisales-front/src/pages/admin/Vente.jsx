import SidebarLayout from '../../layouts/sidebar.jsx';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImportExport from '../../components/Importproduit.jsx';
import ExportVente from '../../components/exportvente.jsx';
import  { getIdentifiant, getRole } from '../../components/decodeurtoken.js';


const Vente = () => {
const token = localStorage.getItem("token");
const identifiant = token ? getIdentifiant(token) : null;
const role = token ? getRole(token) : null;

  const [isOnline, setIsOnline] = useState(navigator.onLine);
    useEffect(() => {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
  
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);
    const [vente, setVente] = useState([]);
    const [filteredvente, setFilteredvente] = useState([]);
   useEffect(() =>{
      const getallventes=async ()=>{
        try {
          const response=await fetch(`http://localhost:8005/api/vente/all?identifiant=${encodeURIComponent(identifiant)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
          const data=await response.json();
          setVente(data)
          setFilteredvente(data)
        } catch (error) {
          console.log("error fetching",error)
        }
      }
      getallventes();
    },[])
     const navigate = useNavigate();
       const handleFilter = (filters) => {
        const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let result = [...vente];
        if (filters.search) {
          result = result.filter((u) =>
            (u.produitNom && normalize(u.produitNom).includes(normalize(filters.search))) ||
            (u.userNom && normalize(u.userNom).includes(normalize(filters.search))) ||
            (u.posNom && normalize(u.posNom).includes(normalize(filters.search)))
          );
        }
        if (filters.region) {
          result = result.filter((u) => u.regionNom === filters.region);
        }
        if (filters.distributeur) {
          result = result.filter((u) => u.distributeurNom === filters.distributeur);
        }
        if (filters.pos) {
          result = result.filter((u) => u.posNom === filters.pos);
        }
         if(filters.startDate && filters.endDate) {
          result = result.filter((u) =>{
            const date = new Date(u.datevente);
            return(
              date >= new Date(filters.startDate) &&
              date <= new Date(filters.endDate)
            );
         } );
        }
    setFilteredvente(result) 
    
  }


  return (
    <div>
        <div className='fixed left-0 top-0 right-0 z-10'><SidebarLayout /></div>

     <div className="relative flex  min-h-screen flex-col pt-10  overflow-x-hidden"style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}    >
    <form>
      <div className=" layout-container flex h-full grow flex-col  ">
       
        <div className="px-20 flex flex-1 justify-center py-5">
          <div className=" p-4 layout-content-container flex flex-col min-w-[450px] ">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight ">Records des ventes</p>
              </div>
               {!isOnline && (
                  <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
                    Mode hors ligne activé – vos ventes seront enregistrées localement et synchronisées plus tard.
                  </div>
                )}
                <div className='flex space-x-2'>
               <button type='button' onClick={()=>navigate("/dashboard/ajouter_vente")}
                  className="flex   cursor-pointer items-center justify-center overflow-hidden rounded-full   px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate"> Ajouter une vente</span>
                </button>
               
              <ExportVente identifiant={identifiant} />
                </div>

  
            </div>

          <div className='p-3'>
           <SearchAndFilter  onFilter={handleFilter}  showdistributeur showdatefilter/>
          </div>
            <div className=" py-3 overflow-x-auto  max-h-[500px] overflow-y-auto">
            <div className="flex min-w-[1500px] w-full overflow-hidden rounded-xl border border-[#dde0e3] bg-white ">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Vente ID</th>
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Vendeur ID</th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Date</th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Distributeur</th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Region</th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-360 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">POS</th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-600 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Produit</th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-720 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Quantité
                      </th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-840 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Montant total
                      </th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-1080 px-4 py-3 text-left  w-60 text-[#6a7581] text-sm font-medium leading-normal">
                        Note
                      </th>
                      <th className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-1080 px-4 py-3 text-left  w-60 text-[#6a7581] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredvente.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-4">
                          Aucunne vente trouvée.
                        </td>
                      </tr>
                    ) : ( filteredvente.map((vente,index)=>(
                    <tr key={vente.id} className="border-t border-t-[#dde0e3]">
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">{vente.id}</td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">{vente.userNom ||"-"}</td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-240 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                        {vente.datevente}
                      </td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-480 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                        {vente.distributeurNom}
                      </td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-360 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">{vente.regionNom}</td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-360 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">{vente.posNom}</td>
                      
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-600 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">{vente.produitNom}</td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-720 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">{vente.quantity}</td>
                      <td className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-840 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">{vente.totalprice}</td>
                      
                      <td
                            className="table-3ffd1a94-e09e-427f-86de-552cdf5e5526-column-1080 h-[72px] px-4 py-2 w-60 text-[#0a0a0a] text-sm font-bold leading-normal tracking-[0.015em] truncate relative group cursor-pointer"
                            title={vente.note} 
                          >
                            <span className="block truncate max-w-full">
                              {vente.note}
                            </span>

                            
                            <div className="absolute left-0 bottom-full mb-1 w-max max-w-xs bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal break-words">
                              {vente.note}
                            </div>
                      </td>
                      <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-720 h-[72px] px-4 py-2 w-60 text-[#6a7581] text-sm font-bold leading-normal tracking-[0.015em]" >
                        <span onClick={()=>navigate(`/dashboard/${vente.id}/modifier_vente`)} className="cursor-pointer">Modifier</span>
                      </td>
                    </tr>
                      )) )}
                  </tbody>
                </table>
              </div>
             
            </div>
          </div>
        </div>
      </div>
      </form>
    </div>
    </div>
  );
};

export default Vente;
