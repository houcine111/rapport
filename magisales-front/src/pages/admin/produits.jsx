import SidebarLayout from '../../layouts/sidebar.jsx';
import SearchAndFilter from '../../components/searchandfiltre.jsx';
import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImportExport from '../../components/Importproduit.jsx';
import  { getIdentifiant, getRole } from '../../components/decodeurtoken.js';


const Produit = () => {
  const token = localStorage.getItem("token");
  const identifiant = getIdentifiant(token);
  const role = getRole(token);

const [produits, setProduits] = useState([]);
const [filteredproduit, setFilteredproduit] = useState([]);
const navigate = useNavigate();

 const getAllproduits=async ()=>{
    try {
      const response=await fetch('http://localhost:8005/api/stock_produit/produits/all' ,{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  })
      const data=await response.json();
     // console.log(data);
      setProduits(data)
      setFilteredproduit(data)
    } catch (error) {
      console.log("error fetching",error)
    }
  }
  useEffect(() => {
   
    getAllproduits();
  }, []);
 const handleFilter = (filters) => {
    let result = [...produits];

    if (filters.search) {
      result = result.filter((u) =>
        u.nomproduit.toLowerCase().includes(filters.search.toLowerCase())
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
    if (filters.statut) {
      result = result.filter((u) => u.active === (filters.statut === "Actif"));
    }

    setFilteredproduit(result);
  };
 
    return (
        <div>
         <div className='fixed left-0 top-0 right-0 z-10 '><SidebarLayout /></div>
        <div className=" p-5 relative flex size-full  flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
>
            <div className="  layout-container flex h-full grow flex-col">
              
        <div className="px-4 sm:px-20  flex  justify-center ">
          <div className="layout-content-container flex flex-col min-w-[200px]  ">
            <div className="flex flex-wrap sm:flex-col gap-3 p-4">
              <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Produits</p>
              {role==="ADMIN" &&
              <>
              <button onClick={()=>navigate("/dashboard/ajouter_produit")}
                className="flex min-w-[84px] max-w-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-medium leading-normal"
              >
                    <span className="truncate">Ajouter un produit</span>
              </button>
               <ImportExport  importUrl="http://localhost:8005/api/import/file"
               exportUrl="http://localhost:8005/api/stock_produit/produit/export"
               fileName="produits.xlsx"
               onImportSuccess={getAllproduits}
               />
              </>
              }
                 
           
              
            </div>
          
            <SearchAndFilter onFilter={handleFilter} showStatutFilter/>
            <div className="pt-5 py-3 overflow-x-auto md:overflow-x-auto  max-h-[500px] overflow-y-auto">
              <div className="min-w-[800px] max w-full  flex  rounded-xl border border-[#dde0e3] bg-white">
                <table className="min-w-full sm:w-full ">
                  <thead>
                    <tr className="bg-white">
                      <th className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-120 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                       Nom Produit
                      </th>
                      <th className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-240 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Code Interne
                      </th>
                      <th className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-360 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">Code-barres</th>
                      <th className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-360 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">prix-unitaire</th>
                      <th className="table-cfc4f974-05bd-4e0d-9c54-d45690917229-column-480 px-4 py-3 text-left text-[#121416] w-[400px] text-sm font-medium leading-normal">
                        Statut
                      </th>
                      <th className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-720 px-4 py-3 text-left w-60 text-[#6a7581] text-sm font-medium leading-normal">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                       {filteredproduit.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-4">
                          Aucun utilisateur trouvé.
                        </td>
                      </tr>
                       ):(
                         filteredproduit.map((produits,index) => (
                              <tr key={produits.id} className="border-t border-t-[#dde0e3]">
                              <td  className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-120 h-[72px] px-4 py-2 w-[400px] text-[#121416] text-sm font-normal leading-normal">
                                {produits.nomproduit}
                              </td>
                              <td className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-240 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">{produits.codeinterne}</td>
                              <td className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-360 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                                 {produits.barcode}
                              </td>
                              <td className="table-71c7a904-ff27-4650-9184-0fb00989f721-column-360 h-[72px] px-4 py-2 w-[400px] text-[#0a0a0a] text-sm font-normal leading-normal">
                                {produits.price}
                              </td>
                              <td>
                               <button
                            className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 ${
                              produits.active ? 'bg-[#f0f2f5] text-[#111418]' : 'bg-red-100 text-red-700'
                            } text-sm font-medium leading-normal w-full`}
                            type="button"
                          >
                            <span className="truncate">{produits.active ? 'Active' : 'Inactive'}</span>
                          </button>
                        </td>
                              
                              <td className="  table-71c7a904-ff27-4650-9184-0fb00989f721-column-720 h-[72px] px-4 py-2 w-60 text-[#6a7581] text-sm font-bold leading-normal tracking-[0.015em]">
                                  {role === "ADMIN" ?(
                                    <>
                                <span onClick={()=>navigate( `/dashboard/${produits.id}/modifier_produit`)}>Modifier</span>
                               
                                </>
                                  ):"-"}
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
    )
}
export default Produit;