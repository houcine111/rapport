import SidebarLayout from '../../layouts/sidebar.jsx';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImportExport from '../../components/Importproduit.jsx';
import  { getIdentifiant, getRole } from '../../components/decodeurtoken.js';

const Stock = () => {

  const token = localStorage.getItem("token");
  const identifiant =token ? getIdentifiant(token):null;
  const rolefromtoken =token ? getRole(token): null;
  const [stock, setStock] = useState([]);
  const [filteredstock, setFilteredstock] = useState([]);
    const [role, setRole] = useState(rolefromtoken || null);

 
  useEffect(() =>{
    const getallstocks=async ()=>{
      try {
        const response=await fetch(`http://localhost:8005/api/stock_produit/stocks/all?identifiant=${encodeURIComponent(identifiant)}`,
      {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, 
    },
  }
      )
        if (!response.ok) throw new Error(`Erreur serveur : ${response.status}`);
        const data=await response.json();
        setStock(data)
        setFilteredstock(data)
      } catch (error) {
      }
    }
    getallstocks();
  },[])
  const navigate = useNavigate();
   const handleFilter = (filters) => {
    let result = [...stock];

    if (filters.search) {
        const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      result = result.filter((u) =>
        (u.produit && normalize(u.produit).includes(normalize(filters.search))) ||
        (u.nomstock && normalize(u.nomstock).includes(normalize(filters.search))) ||
        (u.pos && normalize(u.pos).includes(normalize(filters.search)))
    
      );
    }
    if (filters.region) {
      result = result.filter((u) => u.region === filters.region);
    }
     if (filters.distributeur) {
      result = result.filter((u) => u.distributeur === filters.distributeur);
    }
    if (filters.source) {
  result = result.filter((u) =>
    u.source && u.source.toLowerCase() === filters.source.toLowerCase()
  );
}
   
    if (filters.pos) {
      result = result.filter((u) => u.pos === filters.pos);
    }
    if (filters.statut) {
      result = result.filter((u) => u.active === (filters.statut === "Actif"));}
     if(filters.startDate && filters.endDate) {
          result = result.filter((u) =>{
            const date = new Date(u.datemodification);
            return(
              date >= new Date(filters.startDate) &&
              date <= new Date(filters.endDate)
            );
         } );
        }

    setFilteredstock(result);
  };

  
  return (
    <div className=''>
              <div className='fixed left-0 top-0 right-0 z-10'><SidebarLayout /></div>

      <div className="relative flex-1  min-h-screen flex-col  overflow-x-hidden pt-10" style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}>
      <div className="   layout-container flex h-full grow flex-col">
        
        <div className="px-20 flex flex-1 justify-center py-5 ">
          <div className="  layout-content-container flex flex-col min-w-[400px] ">
            <div className=" flex-1 space-y-4 gap-3 p-8 ">
              
                <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight">Stock </p>
                {role==="ADMIN" &&
                <button
                  className=" min-w-[70px]  cursor-pointer  overflow-hidden rounded-full h-10 px-4 bg-[#3e7abb] text-white text-sm font-bold  tracking-[0.015em]"
                >
                  <span onClick={()=>navigate("/dashboard/ajouter_stock")} className="truncate"> Ajouter une entrée de stock</span>
                </button>
              }
              <ImportExport
  exportUrl={`http://localhost:8005/api/stock_produit/stock/export?identifiant=${encodeURIComponent(identifiant)}`}
  fileName="stocks.xlsx"
/>              
            </div>
<div className='p-3'>
            <SearchAndFilter  onFilter={handleFilter} showSourceFilter  showdistributeur showdatefilter showStatutFilter/>
</div>
            <div className="  py-3 overflow-x-auto  max-h-[700px] overflow-y-auto ">
            <div className="flex min-w-[950px] max-w-[1500px] w-auto overflow-hidden rounded-xl border border-[#dde0e3] bg-white ">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Nom du produit
                      </th>
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Nom du Stock
                      </th>
                        { (role === "ADMIN" || role=== "SUPERVISEUR" ) && (
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Distributeur
                      </th>
                      )}
                      
                       {(role==="ADMIN" || role=== "SUPERVISEUR") && (
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-360 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Région</th>
                      )}
                      {(role==="ADMIN" || role=== "SUPERVISEUR") && (
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">POS</th>
                      )}
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Quantité
                      </th>
                    
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Dernière mise à jour
                      </th>
                       {(role==="ADMIN") && (
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Source
                      </th>
                      )}
                       <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Total
                      </th>
                        {role==="ADMIN" && (
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Statut
                      </th>
                    )}
                      { role === "ADMIN" && (
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-720 px-4 py-3 text-left  w-60 text-[#6a7581] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    )}
                    </tr>
                  </thead>
                 <tbody>
  {filteredstock.length === 0 ? (
    <tr>
      <td colSpan={10} className="text-center py-4">
        Aucun stock trouvé.
      </td>
    </tr>
  ) : (
    filteredstock.map((item, index) => (
      <tr key={item.id} className="border-t border-t-[#dde0e3]">
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
          {item.produit}
        </td>
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
          {item.nomstock}
        </td>
         {(role==="ADMIN" || role=== "SUPERVISEUR") && (
        <td className="  overflow-auto text-ellipsis table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
          {item.distributeur}
        </td>
        )}
        
        {(role==="ADMIN" || role=== "SUPERVISEUR") && (
        <td className="max-w-[150px] truncate whitespace-nowrap overflow-hidden text-ellipsis table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-360 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
          {item.region}
        </td>
        )}
         {(role==="ADMIN" || role=== "SUPERVISEUR") && (
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-240 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
          {item.pos}

        </td>
        )}
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
          {item.quantity}
        </td>
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
{item.datemodification 
  ? new Date(item.datemodification).toLocaleDateString('fr-FR') 
  : "-"
}        </td>
        {(role==="ADMIN") && (
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
          {item.source}
        </td>
        )}
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-600 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
          {item.prixtotal ||"-"}
        </td>
        {role==="ADMIN" && (
          <td className="h-[72px] px-4 py-2 w-[150px] text-sm font-normal leading-normal">
                          <button
                            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 ${
                              item.active ? 'bg-[#f0f2f5] text-[#111418]' : 'bg-red-100 text-red-700'
                            } text-sm font-medium leading-normal w-full`}
                            type="button"
                          >
                            <span className="truncate">{item.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
        )}
        {role==="ADMIN"&&
        <td className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-720 h-[72px] px-4 py-2 w-60 text-[#6a7581] text-sm font-bold leading-normal tracking-[0.015em]" >
        <span onClick={()=>navigate(`/dashboard/${item.id}/modifier_stock`)} className="cursor-pointer">Modifier</span>
        </td>
        }
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

export default Stock;
