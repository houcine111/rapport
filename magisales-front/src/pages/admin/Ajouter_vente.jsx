import SidebarLayout from '../../layouts/sidebar.jsx';
import Select from 'react-select';
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { saveSale } from '../commercial/saleservice.js';
import { syncSales } from '../commercial/syncService.js';
import { searchStocks,saveStocks } from '../../dbindex/db.js';
import { debounce } from "lodash";
import { getIdentifiant, getRole } from '../../components/decodeurtoken.js';
const AjouterVente = () => {
   const [searchInput, setSearchInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
   const [isOnline, setIsOnline] = useState(navigator.onLine);
const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const role = token ? getRole(token) : null;

    const navigate = useNavigate();
    const [userInfos, setUserInfos] = useState({
  posId: "",
  posNom: "",
  regionId: "",
  regionNom: "",
  distributeurId: "",
  distributeurNom: ""
});
useEffect(() => {
 
    fetch(`http://localhost:8005/api/user/details?identifiant=${identifiant}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
      .then(res => res.json())
      .then(data => {
        setUserInfos(data);
         if (role === "COMMERCIAL") {
        setVente(prev => ({
          ...prev,
          posId: data.posId,
          regionId: data.regionId,
          distributeurId: data.distributeurId
        }));
      }
      })
      .catch(err => console.error("Erreur récupération infos user:", err));
  
}, []);

  const [vente, setVente] = useState({
  distributeurId: "",
   stockId:  "",
  posId: "",
  regionId: "",
  quantity: "",
  prixUnitaire: "",
  note: "",
  totalprice:0,
  identifiant: identifiant,
  
});
const handleChange = (e) => {
  const { name, value } = e.target;

  setVente((prev) => {
    const updated = { ...prev, [name]: value };

    // recalcul totalprice si quantity ou prixUnitaire changent
    if (name === "quantity" || name === "prixUnitaire") {
      const qty = name === "quantity" ? Number(value) : Number(prev.quantity);
      const prix = name === "prixUnitaire" ? Number(value) : Number(prev.prixUnitaire);
      updated.totalprice = qty * prix;
    }

    return updated;
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
   //console.log("Form submitted", vente);
  
  
     const payload = {
      stockId: vente.stockId,
      quantity: Number(vente.quantity),
      note: vente.note,
      regionId: vente.regionId,
      distributeurId: vente.distributeurId,
      posId: vente.posId,
      identifiant: vente.identifiant,
      date: new Date().toISOString(),
      isSynced: false,
    };
    if (!navigator.onLine) {
    
    await saveSale(payload);
    alert("Vente enregistrée hors ligne");
    navigate("/dashboard/vente");
    return;
  }
   
    try {
    await axios.post("http://localhost:8005/api/vente/ajouter", payload, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
    alert("Vente ajoutée avec succès");
    navigate("/dashboard/vente"); // redirection après ajout
  } catch (error) {
    if (error.response && error.response.data) {
      const msg = error.response.data.message || 'Erreur lors de l’ajout de la vente';
      setErrorMsg(msg);
      console.error("Erreur backend:", msg);
      alert(msg);
    } else {
      console.error("Erreur inconnue:", error.message);
      alert('Erreur lors de l’ajout de la vente');
    }
    console.error(error);
    alert("Erreur lors de l'ajout de la vente");
  }
};
const [distributeurs, setDistributeurs] = useState([]);
const [pos, setPosList] = useState([]);
const [regions, setRegions] = useState([]);
  const [produitOptions, setProduitOptions] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);

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
useEffect(() => {
  fetch("http://localhost:8005/api/add/distributeur/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  })
    .then(res => res.json())
    .then(setDistributeurs);

 

  fetch("http://localhost:8005/api/add/pos/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  })
    .then(res => res.json())
    .then(setPosList);

  fetch("http://localhost:8005/api/add/region/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  })
    .then(res => res.json())
    .then(setRegions);
}, []);
const handleInputChange = (inputValue) => {
  setSearchInput(inputValue);
};


const debouncedFetchProduits = useCallback(
  debounce(async (searchInput, setProduitOptions) => {
    if (searchInput.length >= 2) {
      try {
        if (navigator.onLine) {
          const res = await fetch(`http://localhost:8005/api/stock_produit/stock/search?keyword=${encodeURIComponent(searchInput)}&identifiant=${identifiant}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
          if (!res.ok) throw new Error("Erreur fetch produits");
          const data = await res.json();

          await saveStocks(data);

          const mapped = data.map(p => ({
            value: p.stockId,
            label: `${p.nomstock} - ${p.produitNom} (Stock: ${p.quantity}) - ${p.regionNom} - ${p.posNom} - ${p.distributeurNom}`,
            price: p.prixUnitaire,
            regionNom: p.regionNom,
            posNom: p.posNom,
            posId: p.posId,
            regionId: p.regionId,
            distributeurId: p.distributeurId,
            distributeurNom: p.distributeurNom
          }));
          setProduitOptions(mapped);
        } else {
          const offlineResults = await searchStocks(searchInput);
          setProduitOptions(
            offlineResults.map(p => ({
              value: p.stockId,
              label: `${p.nomstock} - ${p.produitNom} (Stock: ${p.quantity} ) `,
              price: p.prixUnitaire
            }))
          );
        }
      } catch (err) {
        console.error("Erreur recherche produit:", err);
      }
    } else {
      setProduitOptions([]);
    }
  }, 500),
  []
);
useEffect(() => {
  debouncedFetchProduits(searchInput, setProduitOptions);
}, [searchInput, debouncedFetchProduits]);


  useEffect(() => {
  if (selectedProduit) {
    setVente(prev => {
      const qty = Number(prev.quantity) || 0;
      const prix = selectedProduit.price || 0;
      const updated = {
        ...prev,
        stockId: selectedProduit.value,
        prixUnitaire: prix,
        totalprice: qty * prix,
      };

      // Si admin, on pré-remplit pos/region/distributeur à partir du produit
      if (role === "ADMIN") {
        updated.posId = selectedProduit.posId;
        updated.regionId = selectedProduit.regionId;
        updated.distributeurId = selectedProduit.distributeurId;
      }

      return updated;
    });
  }
}, [selectedProduit, role]);


  return (
    <div>
        <div className='fixed left-0 z-10'><SidebarLayout /></div>
     <div
      className="relative z-20 flex  min-h-screen flex-col ml-44 overflow-x-hidden"
            style={{
            '--select-button-svg': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(106,117,129)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
            fontFamily: 'Inter, "Noto Sans", sans-serif'
            }} >   
     <form onSubmit={handleSubmit}>
      {errorMsg && (
      <div className="text-red-600 font-semibold mb-4 px-4">
        {errorMsg}
      </div>
      )}
      <div className=" sm:ml-72 layout-container flex h-full grow flex-col">
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
         
          <div className="layout-content-container flex flex-col min-w-[400px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-8"><p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Ajouter une vente</p></div>
            {!isOnline && (
                  <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">
                    Mode hors ligne activé – vos ventes seront enregistrées localement et synchronisées plus tard.
                  </div>
                )}
           <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Produit *</p>
                <Select  options={produitOptions} value={selectedProduit}  onChange={setSelectedProduit} onInputChange={handleInputChange}
                 isSearchable isClearable/>
                 
                 
              </label>
            </div>
            <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4">Prix Unitaire:<span>{vente.prixUnitaire ? vente.prixUnitaire.toFixed(2) : "0.00"}</span>
 </p>
 <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Distributeur*</p>
                <select
                  name='distributeurId' value={vente.distributeurId}  onChange={handleChange}  disabled={role === "COMMERCIAL"}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  {role === "COMMERCIAL" ? (
                        <option value={vente.distributeurId || ""}>{userInfos.distributeurNom}</option>
                      ) : (
                        <>
                          <option value={selectedProduit?.distributeurId || ""}>{selectedProduit?.distributeurNom || "Sélectionner"}</option>
                          {distributeurs.map(d => (
                            <option key={d.id} value={d.id}>{d.nom}</option>
                          ))}
                        </>
                      )}
                </select>
              </label>
            </div>
             <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Region</p>
                <select
                  name='regionId' value={vente.regionId}  onChange={handleChange}  disabled={role === "COMMERCIAL"}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  {role === "COMMERCIAL" ? (
                      <option value={vente.regionId || ""}>{userInfos.regionNom}</option>
                    ) : (
                      <>
                        <option value={selectedProduit?.regionId || ""}>{selectedProduit?.regionNom || "Sélectionner"}</option>
                        {regions.map(r => (
                          <option key={r.id} value={r.id}>{r.nom}</option>
                        ))}
                      </>
                    )}                    
                 
                </select>
              </label>
            </div>
           <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Point de vente*</p>
                <select name='posId' value={vente.posId} onChange={handleChange}   disabled={role === "COMMERCIAL"}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                {role === "COMMERCIAL" ? (
                      <option value={vente.posId || ""}>{userInfos.posNom}</option>
                    ) : (
                      <>
                        <option value={selectedProduit?.posId || ""}>{selectedProduit?.posNom || "Sélectionner"}</option>
                        {pos.map(p => (
                          <option key={p.id} value={p.id}>{p.nom}</option>
                        ))}
                      </>
                    )}                  
                </select>
              </label>
            </div>
             
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Quantite</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                  value={vente.quantity} type='number' onChange={handleChange} name='quantity'
                />
              </label>
            </div>
           
           
           
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Note Optionnelle</p>
                <textarea name='note' value={vente.note} onChange={handleChange}
                  placeholder="Ajouter des détails supplémentaires sur la vente"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-36 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
<div className='font-bold text-xl'>
  Le prix total : <span className='text-red-500'>{vente.totalprice ? vente.totalprice.toFixed(2) : "0.00"} MAD</span>
</div>            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                <button type='submit' 
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#417dbd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Enregistrer la Vente</span>
                </button>
                <button type='button' onClick={()=>navigate("/dashboard/vente")}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Annuler</span>
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

export default AjouterVente;