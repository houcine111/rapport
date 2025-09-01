import SidebarLayout from '../../layouts/sidebar.jsx';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Addproduit = () => {
  const token=localStorage.getItem("token");
  
   const navigate = useNavigate();
   const [errorMsg, setErrorMsg] = useState("");
   const [loading, setLoading] = useState(false);
     const [produit, setProduit] = useState({
        nomproduit: "",
        codeinterne: "",
        barcode: "",
        price: "",  
      });
const handleChange =useCallback( (e) => {
const { name, value } = e.target;
setProduit((prev) => ({ ...prev, [name]: value }));
}, []);  
 const validateForm = () => {
    if (!produit.nomproduit.trim()) {
      setErrorMsg("Le nom du produit est requis.");
      return false;
    }
    if (produit.price === "" || isNaN(produit.price) || Number(produit.price) <= 0) {
      setErrorMsg("Veuillez saisir un prix unitaire valide (> 0).");
      return false;
    }
    setErrorMsg("");
    return true;
  };
const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
     if (!validateForm()) return;
     setLoading(true);
    
     // console.log("data send",produit)
     try {
      await axios.post('http://localhost:8005/api/stock_produit/addprod', {

        ...produit,
        price: Number(produit.price), 
      },
     {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
      alert('Produit ajouté avec succès');
      setProduit({ nomproduit: "", codeinterne: "", barcode: "", price: "" }); 
      navigate('/dashboard/produits');
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de l’ajout du produit';
      setErrorMsg(msg);
      console.error(msg);
      alert('Erreur lors de l’ajout du produit');
    }
    finally {
      setLoading(false);
    }
  }, [produit, navigate]);

  const handleMultiChange = (e) => {
  const { options, name } = e.target;
  const values = [];
  for (let i = 0; i < options.length; i++) {
    if (options[i].selected) {
      values.push(options[i].value);
    }
  }
  setProduit(prev => ({ ...prev, [name]: values }));
};
    return (
        <div>
        <div className='fixed  left-0 z-10 '><SidebarLayout /></div>

        <div className="relative flex size-full  flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <form onSubmit={handleSubmit} noValidate>
        {errorMsg && (
  <div className="text-red-600 font-semibold mb-4 px-4">
    {errorMsg}
  </div>
)}
      <div className="layout-container flex  grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="  layout-content-container flex flex-col w-[512px] max-w-[512px] p-4 flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Ajouter un produit</p></div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Nom du produit</p>
                <input name='nomproduit'
                  placeholder="Entrez le nom du produit"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit.nomproduit} onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Code interne</p>
                <input
                  placeholder="Entrez le code interne" name='codeinterne'
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit.codeinterne} onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Code-barres</p>
                <input
                  placeholder="Entrez le code-barres" name='barcode'
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit.barcode} onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Prix unitaire</p>
                <input type="number"
                  placeholder="Entrez le prix unitaire" name='price'
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit.price} onChange={handleChange}
                />
              </label>
            </div>
            
           
           
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button type="button" onClick={() => navigate('/dashboard/produits')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Annuler</span>
                </button>
                <button type='submit' disabled={loading}
                  className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4
                  ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#3e7abb] text-white"}`}
                >
                   <span className="truncate">{loading ? "Enregistrement..." : "Enregistrer"}</span>
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
export default Addproduit;