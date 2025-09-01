import SidebarLayout from '../../layouts/sidebar.jsx';
import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

const Modifier_stock = () => {
 const token=localStorage.getItem("token");

  const [errorMsg, setErrorMsg] = useState("");
  const { id } = useParams();
    const navigate = useNavigate();
      const [produits, setProduits] = useState([]);
 const [selectedPos, setSelectedPos] = useState([]);
  const [posOptions, setPosOptions] = useState([]);
   const [stock, setStock] = useState({
     produitId:  "",
     posList: [],
     distributeurs: [],
     nomstock:"",
     regions:[],
     note: "",
     quantity:"",
     source: "",
       });
const [regions, setRegions] = useState([]);
const [Pos, setPoss] = useState([]);
const [distributeur, setDistributeur] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };
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
         //console.log("data:", data);
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
  }) 
       .then((response) => response.json())
       
       .then((data) => {
         //console.log("data:", data);
         setDistributeur(data); 
       })
       .catch((error) => console.error("Erreur fetch poss:", error));
   }, []);
    useEffect(() => {
         const fetchstock= async()=>{
         try {
const response = await fetch(`http://localhost:8005/api/stock_produit/stock/${id}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
});         const data=await response.json();
         //console.log(data);
         setStock({
  ...data,
  produitId: data.produit?.id || "", 
  posList: data.posList?.map(p => p.id) || [],
  distributeurs: data.distributeurs?.map(d => d.id) || [],
  regions: data.regions?.map(r => r.id) || [],
  nomstock:data.nomstock
});
   setSelectedPos(
        data.posList?.map(p => ({ value: p.id, label: p.pos })) || []
      );
        
         } catch (error) {
           console.log("error de fetch produit")
         }
       };
       fetchstock();
     
            
        }, [id]);
useEffect(() => {
  setStock(prev => ({
    ...prev,
    posList: selectedPos.map(pos => pos.value)   
  }));
}, [selectedPos]);

  const handleMultiSelect = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options).filter((o) => o.selected).map((o) => Number(o.value));
    setStock((prev) => ({ ...prev, [name]: values }));
  };
 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     // console.log(stock);
      await axios.put(`http://localhost:8005/api/stock_produit/${id}/modifierstock`, stock,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // <-- Ajout du token
    },
  });
      alert('Stock modifié avec succès');
      navigate("/dashboard/stock");
    } catch (error) {
      const msg = error.response.data.message || 'Erreur lors de la modification du stock';
      setErrorMsg(msg);
      console.error(msg);
      alert(msg);
    }
  };
   useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await axios.get("http://localhost:8005/api/stock_produit/produits/all", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
        setProduits(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
      }
    };

    fetchProduits();
  }, []);
   const handleFreeze = () => {
    const newActiveStatus = !stock.active; 
  
    const message = newActiveStatus
      ? "Voulez-vous vraiment activer ce stock ?"
      : "Voulez-vous vraiment geler ce stock ?";
  
    if (window.confirm(message)) {
      fetch(`http://localhost:8005/api/stock_produit/freeze/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ active: newActiveStatus }),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Erreur lors de la mise à jour");
          alert(newActiveStatus ? "stock activé avec succès !" : "stock gelé avec succès !");
          
          setStock((prevStock) => ({
            ...prevStock,
            active: newActiveStatus,
          }));
        })
        .catch((err) => alert(err.message));
    }
  };
  const handlePosInputChange = (inputValue, { action }) => {
  const lower = inputValue.toLowerCase();

  if (action === 'input-change') {
    if (lower === 'all' || lower === 'tout') {
      setSelectedPos(posOptions); 
    } else if (lower === 'none' || lower === 'aucun') {
      setSelectedPos([]); 
    }
  }
};

  return (
    <div>
      <div className='fixed  left-0 z-10'><SidebarLayout /></div>
        
       <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
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
  <select
    name="produitId"
    value={stock.produitId }
    onChange={handleChange}
    className="border rounded-xl p-2"
  >
    <option value="">-- Choisir un produit --</option>
    {produits.map((p) => (
      <option key={p.id} value={p.id}>
        {p.nomproduit}
      </option>
    ))}
  </select>
</label>
            </div>
           <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">nom du stock</p>
                <input name='nomstock' value={stock.nomstock ||""} onChange={handleChange}
                  placeholder="Entrez le nom du stock"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Distributeurs*</p>
                <select name='distributeurs' multiple value={stock.distributeurs} onChange={handleMultiSelect}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                required>
                  <option value="">Sélectionner un distributeur</option>
                  {distributeur.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.distributeur}
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
      onChange={(selected) => setSelectedPos(selected || [])}
      onInputChange={handlePosInputChange}
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
                  <option value="internel">Internel</option>
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
            <label className='text-red-400 text-sm'>vous voulez geler ce stock</label>
             <button  type='button' onClick={() => handleFreeze()}
                  className=" flex min-w-[84px] max-w-[480px] cursor-pointer gap-2 items-center justify-center overflow-hidden rounded-full h-10 px-4  bg-sky-200 text-black text-sm font-bold leading-normal tracking-[0.015em]"
                >
                      <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    <path d="M12 2v20M5 6l14 12M5 18l14-12" />
    <path d="M12 12l7-5M12 12l7 5M12 12l-7 5M12 12l-7-5" />
  </svg>
                   <span>{stock.active ? "Geler" : "Dégeler"}</span>
                </button>
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

export default Modifier_stock;
