import SidebarLayout from '../../layouts/sidebar.jsx';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import React, { useState,useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';

const Couverture = () => {
  const [couverture, setCouverture] = useState([]);
  const[filtredcouverture,setFiltredcouverture]=useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  useEffect(() => {
    const getallcouverture = async () => {
      try {
        const response = await fetch('http://localhost:8005/api/couverture/stock/all');
        const data = await response.json();
        console.log(data);
        setCouverture(data);
        setFiltredcouverture(data);
      } catch (error) {
        alert("Erreur de chargement des données" + error.message);
        console.log("error fetching", error);
      }
    };
    getallcouverture();
  }, []);
  const handleFilter = (filters) => {
        const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        let result = [...couverture];
        if (filters.search) {
          result = result.filter((u) =>
            (u.produitNom && normalize(u.produitNom).includes(normalize(filters.search))) ||
            (u.nomStock && normalize(u.nomStock).includes(normalize(filters.search))) 
          );
        }
        if (filters.region) {
          result = result.filter((u) => u.regions === filters.region);
        }
        if (filters.distributeur) {
          result = result.filter((u) => u.distributeurs === filters.distributeur);
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
    setFiltredcouverture(result)

  }
  return (
     <div className=''>
               <div className='fixed left-0 top-0 right-0 z-10'><SidebarLayout /></div>
 
       <div className=" relative flex  min-h-screen flex-col  overflow-x-hidden pt-10" style={{
     '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
     fontFamily: `"Inter", "Noto Sans", sans-serif`
   }}>
       <div className="    layout-container flex h-full grow flex-col">
         
         <div className="px-20 flex flex-1 justify-center py-5 ">
           <div className="p-4 layout-content-container flex flex-col min-w-[450px] ">
            <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Couverture</p>

             <div className='p-4'>
               <SearchAndFilter  onFilter={handleFilter} showregionfilter  showdistributeur showdatefilter/>
             </div>
             
             <div className="  py-3 overflow-x-auto  max-h-[700px] overflow-y-auto ">
             <div className="flex min-w-[900px] w-full overflow-hidden rounded-xl border border-[#dde0e3] bg-white ">
                 <table className="min-w-full table-auto">
                   <thead>
                     <tr className="bg-white">
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                         Nom du produit
                       </th>
                        <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                         Nom du Stock
                       </th>
                         { (role === "ADMIN"  ) && (
                        <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                         Distributeur
                       </th>
                       )}
                       
                        {(role==="ADMIN") && (
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-360 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Région</th>
                       )}
                      
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">qte stock</th>
                        <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">qte de vente </th>

                       
                     
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                         Dernière mise à jour
                       </th>
                        
                        <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                         Couverture
                       </th>
                       
                      
                     </tr>
                   </thead>
                  <tbody>
   {filtredcouverture.length === 0 ? (
     <tr>
       <td colSpan={10} className="text-center py-4">
         Aucunne couverture trouvé.
       </td>
     </tr>
   ) : (
     filtredcouverture.map((item, index) => (
       <tr key={index} className="border-t border-t-[#dde0e3]">
         <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
           {item.produitNom}
         </td>
         <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
           {item.nomStock}
         </td>
          {(role==="ADMIN" || role=== "SUPERVISEUR") && (
         <td className="  overflow-auto text-ellipsis table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
           {item.distributeurs}
         </td>
         )}
         
         {(role==="ADMIN" ) && (
         <td className="max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-360 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
           {item.regions}
         </td>
         )}
          
         <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-240 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
           {item.qteStock}
         </td>
         <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-240 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
           {item.qteVente || "-"}
         </td>
        
         <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
           {item.updatedAt ||"-" } 
         </td>
         
         <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#6a7581] text-sm font-normal leading-normal">
           {item.couverture ||"-"}
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
   );
};

export default Couverture;
