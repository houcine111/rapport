import SidebarLayout from '../../layouts/sidebar.jsx';
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import  { getIdentifiant, getRole } from '../../components/decodeurtoken.js';
import { debounce } from "lodash";

const AddStock = () => {
  const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const role = token ? getRole(token) : null;

  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [regions, setRegions] = useState([]);
  const [distributeur,setDistributeur]=useState([]);
  const [Pos, setPoss] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedPos, setSelectedPos] = useState([]);
  const [posOptions, setPosOptions] = useState([]);
  const [stock, setStock] = useState({
  produitId: selected,
  posList: [],
  regions:[],
  distributeurs:[],
  nomstock:"",
  note: "",
  quantity:"",
  source: "",
    });
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
 
  useEffect(() => {
      fetch("http://localhost:8005/api/add/pos/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }) 
        .then((response) => response.json())
        
        .then((data) => {
         
          setPoss(data); 
          setPosOptions(data.map(p => ({ value: p.id, label: p.pos })));
        })
        .catch((error) => console.error("Erreur fetch poss:", error));
    }, []);
     useEffect(() => {
      fetch("http://localhost:8005/api/add/distributeur/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }
        
      ) 
        .then((response) => response.json())
        
        .then((data) => {
          
          setDistributeur(data); 
        })
        .catch((error) => console.error("Erreur fetch distributeur:", error));
    }, []);
  useEffect(() => {
  setStock(prev => ({ ...prev, produitId: selected?.value || null }));
}, [selected]);

useEffect(() => {
  setStock(prev => ({
    ...prev,
    posList: selectedPos && selectedPos.length > 0
      ? selectedPos.map(pos => pos.value)
      : null
  }));
}, [selectedPos]);
 const handleChange = (e) => {
  const { name, value, type } = e.target;
  const val = type === "number" ? Number(value) : value;
  setStock(prev => ({ ...prev, [name]: val }));
};

    const handleSearch = useCallback(
  debounce((inputValue) => {
    if (inputValue.length >= 2) {
      fetch(`http://localhost:8005/api/stock_produit/produits/search?keyword=${inputValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // <-- Ajout du token
        },
      })
        .then(res => res.json())
        .then(data => {
          const mapped = data.map(p => ({ value: p.id, label: p.nomproduit }));
          setOptions(mapped);
        })
        .catch((err) => console.error("Erreur recherche produit:", err));
    }
  }, 500), [] // 500ms de délai
);
  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!stock.produitId) {
    setErrorMsg("Veuillez sélectionner un produit.");
    return;
  }
  if (!stock.quantity || stock.quantity <= 0) {
    setErrorMsg("Veuillez entrer une quantité valide.");
    return;
  }
  setErrorMsg("");
    try {
    //console.log(stock);
      await axios.post('http://localhost:8005/api/stock_produit/addstock', stock,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, 
    },
  });
    
      alert('Stock ajouté avec succès');
      navigate("dashboard/stock");
    } catch (error) {
       const msg = error.response?.data?.message || 'Erreur lors de l’ajout du stock';
    setErrorMsg(msg);
      console.error(error);
      alert('Erreur lors de l’ajout du stock');
    }
  };
   const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter((o) => o.selected).map((o) => Number(o.value));
    setStock((prev) => ({ ...prev, [name]: values }));
  };
  return (
    <div>
                      <div className='fixed  left-0 z-10'><SidebarLayout /></div>
        
       <div
      className="  relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}>
    <form onSubmit={handleSubmit}>
      {errorMsg && (
  <div className="text-red-600 font-semibold mb-4 px-4">
    {errorMsg}
  </div>
)}
      <div className="layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
        
          <div className="sm:ml-64 layout-content-container flex flex-col max-w-[960px] p-4 flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Ajouter un Stock</p></div>
            <div className="p-4 @container">
              <div className="flex flex-col items-stretch justify-start rounded-xl @xl:flex-row @xl:items-start">
                <div
                  className="max-w-80 bg-center bg-no-repeat aspect-video bg-cover rounded-xl"
                    style={{
                        backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCGjc00HO0i7G9XNbLRr-I5-2VT9bi2fcK1NZB9ibojHxcdN38FAFoF-kgdlKYd4vgkqCsIRs7aK8koT4JNUVjo3AG2SPtYzujHDqg4spFgGAe28zB9n2-pRw9WSQeGIKTYzmye-H4Pe_UxF1uAJuZZbPEXcfPG8APAh8g2p47osOFJWWchNA2mX1amw0maxgcB11IsHXzCJhsMZ5b4tQyoZSV4Csf6fPTqIB2u_KHS_uM3YCBU799mQB5nXnhga--S_0BQWBrTwlk")'
                    }}                ></div>
                
              </div>
            </div>
            
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Produit *</p>
                <Select  options={options} value={selected}  onChange={setSelected} onInputChange={handleSearch}
                 isSearchable isClearable/>
                 
                 
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Nom du stock</p>
                <input name='nomstock' value={stock.nomstock|| ""} onChange={handleChange}
                  placeholder="Entrez le nom du stock"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
             <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Distributeur</p>
                <select
                  name='distributeurs' multiple value={stock.distributeurs} onChange={handleMultiSelect}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">-- Choisir un distributeur --</option>
                    {distributeur.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.distributeur}
                      </option>
                    ))}
                 
                </select>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Region</p>
                <select
                  name='regions' multiple value={stock.regions} onChange={handleMultiSelect}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">-- Choisir une région --</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.region}
                      </option>
                    ))}
                 
                </select>
              </label>
            </div>
           
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
  <label className="flex flex-col min-w-40 flex-1">
    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Point de vente*</p>
    <Select
      isMulti
      options={posOptions}
      value={selectedPos}
      onChange={setSelectedPos}
      classNamePrefix="select"
      placeholder="Sélectionner un ou plusieurs POS"
    />
  </label>
</div>
          
             <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Source*</p>
              <select name='source' value={stock.source} onChange={handleChange} 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">selectionner une source</option>
                  <option value="interne">Interne</option>
                   <option value="platforme">Platfrome</option>
                  
                </select>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Quantité</p>
                <input name='quantity' onChange={handleChange} type='number'
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                  value={stock.quantity}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Note optionnelle</p>
                <textarea value={stock.note} name='note' onChange={handleChange}
                  placeholder="Ajouter une note ou un commentaire..."
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-36 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button type='button' onClick={()=>navigate("/dashboard/stock")}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Annuler</span>
                </button>
                <button type='submit'
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#417dbd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Enregistrer l'entrée de stock</span>
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
};

export default AddStock;
