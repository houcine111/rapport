import SidebarLayout from '../../layouts/sidebar.jsx';
import React, { useState, useEffect ,useCallback} from 'react';
import axios from 'axios';
import Select from 'react-select';
import { debounce } from "lodash";
import  { getIdentifiant, getRole } from '../../components/decodeurtoken.js';

import { useNavigate } from 'react-router-dom';
const AjouterDeclarations = () => {
const navigate = useNavigate();
const [errorMsg, setErrorMsg] = useState("");
const [regions, setRegions] = useState([]);
const token=localStorage.getItem("token");
const identifiant = getIdentifiant(token);
const role = getRole(token);

 useEffect(() => {
     fetch("http://localhost:8005/api/add/region/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }) 
       .then((response) => response.json())
       .then((data) => {
         setRegions(data); 
       })
       .catch((error) => console.error("Erreur fetch regions:", error));
   }, []);
  const [declaration, setDeclaration] = useState(
    {
      identifiant: "",
      type: "",
      region: "",
     
      stockId: "",
      note: ""
    }
  );
  const [stockOptions, setStockOptions] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

 

const handleSearch = useCallback(debounce((inputValue) => {
  if (inputValue.length >= 2) {
    fetch(`http://localhost:8005/api/stock_produit/stock/search?keyword=${inputValue}&identifiant=${identifiant}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // <-- Ajout du token
        },
      })
      .then(res => res.json())
      .then(data => {
        const mapped = data.map(p => ({
          value: p.stockId,
          label: `(Stock: ${p.nomstock})`,
        }));
        setStockOptions(mapped);
      })
      .catch(err => console.error("Erreur recherche stock:", err));
  }
}, 500), [identifiant]);

      useEffect(() => {
    if (selectedStock) {
      setDeclaration(prev => ({
        ...prev,
        stockId: selectedStock.value|| null,
      }));
    }
    else {
      setDeclaration(prev => ({
        ...prev,
        stockId: "",
        region: "",
      }));
    }
  }, [selectedStock]);
const handleChange = (e) => {
  const { name, value } = e.target;
  if (name === "region") {
    const regionObj = regions.find((r) => r.id.toString() === value);
    setDeclaration((prev) => ({
      ...prev,
      region: regionObj || null,
    }));
  } else {
    setDeclaration((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

    const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      identifiant: identifiant, // ou autre selon stockage utilisateur
      type: declaration.type,
      region: role === "SUPERVISEUR" ? null : declaration.region,
      stock_id: Number(declaration.stockId)|| null,
      note: declaration.note,
    };
//console.log("Payload:", payload);
    try {
      await axios.post('http://localhost:8005/api/adddeclaration', payload, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
      alert("Déclaration enregistrée");
      navigate('/dashboard/declarations'); // redirection après succès
    } catch (error) {
       const msg = error.response?.data?.message || "Erreur lors de l'enregistrement";
    setErrorMsg(msg);
      console.error(msg);
      
    }
  };
const handleStockChange = (selectedOption) => {
    setSelectedStock(selectedOption);
  };
    return (
        <div>
            <div className='fixed left-0 z-10'><SidebarLayout /></div>
             <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
            style={{
                '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
                fontFamily: `Inter, "Noto Sans", sans-serif`
            }} >   
            <form onSubmit={handleSubmit}>
              {errorMsg && (
  <div className="text-red-600 font-semibold mb-4 px-4">
    {errorMsg}
  </div>
)}
      <div className="sm:ml-64 layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          
          <div className=" layout-content-container flex flex-col min-w-[450px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-8">
              <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Ajouter une déclaration</p>
            </div>
            <div className="p-4">
              <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
               
               
              </div>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Type de Declaration</p>
                <input name='type' value={declaration.type} onChange={handleChange}
                  placeholder="Entrez le type de déclaration"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">stock</p>
               <Select  options={stockOptions} value={selectedStock} onChange={handleStockChange} onInputChange={handleSearch}
                 isSearchable isClearable/>
                 
                  
                
              </label>
            </div>
            {role !== "SUPERVISEUR" && (
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Region</p>
                <select name='region' value={declaration.region ? declaration.region.id : ""} onChange={handleChange} 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">-- Choisissez une région --</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.region}
                    </option>
                  ))}

                </select>
              </label>
            </div>
            )}
            
           
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Description</p>
                <textarea name='note' value={declaration.note} onChange={handleChange}
                  placeholder="Describe the justification in detail..."
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-36 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
           
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button type="button" onClick={() => navigate('/dashboard/declarations')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate"> Annuler</span>
                </button>
                <button type='submit'
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#417dbd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate"> Enregistrer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
            </form>
    </div>
        </div>
    );
}
export default AjouterDeclarations;