import SidebarLayout from '../../layouts/sidebar.jsx';
import React, { useState, useEffect,useCallback } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
const Modifierproduit = () => {
  const token = localStorage.getItem("token");
  const [errorMsg, setErrorMsg] = useState("");
   const [loading, setLoading] = useState(false);
  const { id } = useParams();
    const navigate = useNavigate();
    const [produit, setProduit] = useState({
      nomproduit: "",
        codeinterne: "",
        barcode: "",
        price: "",
    });
    
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === "price") {
      // Autoriser uniquement chiffres et point
      if (value === "" || /^\d*\.?\d*$/.test(value)) {
        setProduit(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setProduit(prev => ({ ...prev, [name]: value }));
    }
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
 

   useEffect(() => {
    const fetchproduit= async()=>{
    try {
       const response= await  fetch(`http://localhost:8005/api/stock_produit/produit/${id}`,{
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}`
         }
       });
    const data=await response.json();
        //console.log(data);
    setProduit({...data,
          price: data.price ? String(data.price) : "",})
    } catch (error) {
       setErrorMsg("Impossible de récupérer les données du produit");
      console.log("error de fetch produit")
    }
  };
  fetchproduit();

       
   }, [id]);

  const handleSave = useCallback(async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);

  try {
    const dataToSend = { ...produit, price: Number(produit.price), active: produit.active ?? true };

    const response = await fetch(`http://localhost:8005/api/stock_produit/modiferprod/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      const errData = await response.json(); // lire le message d’erreur du backend
      throw new Error(errData?.message || 'Erreur lors de la modification du produit');
    }

    alert('Produit modifié avec succès');
    navigate('/dashboard/produits');

  } catch (error) {
    // Ici on utilise error.message au lieu de error.response.data.message
    setErrorMsg(error.message);
    console.error(error.message);
  } finally {
    setLoading(false);
  }
}, [produit, id, navigate]);

 const handleFreeze = () => {
  const newActiveStatus = !produit.active; 

  const message = newActiveStatus
    ? "Voulez-vous vraiment activer ce produit ?"
    : "Voulez-vous vraiment geler ce produit ?";

  if (window.confirm(message)) {
    fetch(`http://localhost:8005/api/stock_produit/freezeprod/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
     },
      body: JSON.stringify({ active: newActiveStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour");
        alert(newActiveStatus ? "Utilisateur activé avec succès !" : "Utilisateur gelé avec succès !");

        setProduit((prevpr) => ({
          ...prevpr,
          active: newActiveStatus,
        }));
      })
      .catch((err) => alert(err.message));
  }
};
    return (
        <div>
                      <div className='fixed  left-0 z-10 '><SidebarLayout /></div>

       
        <div className="relative flex size-full  flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <form onSubmit={handleSave} noValidate>
          {errorMsg && (
      <div className="text-red-600 font-semibold mb-4 px-4">
        {errorMsg}
      </div>
    )}
      <div className="layout-container flex  grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="  layout-content-container flex flex-col w-[512px] max-w-[512px] p-4 flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Modifier un produit</p></div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Nom du produit</p>
                <input name='nomproduit'
                  placeholder="Entrez le nom du produit"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit?.nomproduit || ''} onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Code interne</p>
                <input name='codeinterne'
                  placeholder="Entrez le code interne"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit?.codeinterne || ''} onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Code-barres</p>
                <input name='barcode'
                  placeholder="Entrez le code-barres"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit?.barcode || ''} onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Prix unitaire</p>
                <input name='price'
                  placeholder="Entrez le prix unitaire"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border-none bg-[#f1f2f4] focus:border-none h-14 placeholder:text-[#6a7581] p-4 text-base font-normal leading-normal"
                  value={produit?.price || ''} onChange={handleChange}
                />
              </label>
            </div>
            <label className='text-red-400 text-sm'>vous voulez geler ce stock</label>
             <button type='button'  onClick={ handleFreeze}
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
                   <span>{produit.active ? "Geler" : "Dégeler"}</span>
                </button>
           
            
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button type='button' onClick={()=>navigate('/dashboard/produits')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Annuler</span>
                </button>
                <button
                      type='submit'
                      disabled={loading}
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
export default Modifierproduit;