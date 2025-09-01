import SidebarLayout from '../../layouts/sidebar.jsx';
import Select from 'react-select';
import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getIdentifiant, getRole } from '../../components/decodeurtoken.js';
import { debounce } from "lodash";

const ModifierVente = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const { id } = useParams(); 
  const navigate = useNavigate();
const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const role = token ? getRole(token) : null;

  const [vente, setVente] = useState({
    distributeurId: "",
    stockId:  "",
    posId: "",
    regionId: "",
    quantity: "",
    prixUnitaire: "",
    note: "",
    totalprice: 0,
    identifiant: identifiant,
  });

  const [distributeurs, setDistributeurs] = useState([]);
  const [pos, setPosList] = useState([]);
  const [regions, setRegions] = useState([]);
  const [produitOptions, setProduitOptions] = useState([]);
  const [selectedProduit, setSelectedProduit] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8005/api/add/distributeur/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }).then(res => res.json()).then(setDistributeurs);
    fetch("http://localhost:8005/api/add/pos/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }).then(res => res.json()).then(setPosList);
    fetch("http://localhost:8005/api/add/region/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }).then(res => res.json()).then(setRegions);
  }, []);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:8005/api/vente/${id}`, {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }})
      .then(res => {
        const data = res.data;
       
        setVente({
          distributeurId: data.distributeurId,
          stockId: data.stockId,
          posId: data.posId,
          regionId: data.regionId,
          quantity: data.quantity,
          prixUnitaire: data.prixUnitaire,
          note: data.note || "",
          totalprice: data.quantity * data.prixUnitaire,
          identifiant: data.identifiant || identifiant,
        });
        setSelectedProduit({
          value: data.stockId,
          label: data.produitNom || "Produit",
          price: data.prixUnitaire,
          regionId: data.regionId,
          posId: data.posId,
          distributeurId: data.distributeurId,
          posNom: data.posNom,
          regionNom: data.regionNom,
          distributeurNom: data.distributeurNom,
        });
      })
      .catch(err => {
        alert("Erreur lors du chargement de la vente.");
        console.error(err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVente(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "quantity" || name === "prixUnitaire") {
        const qty = name === "quantity" ? Number(value) : Number(prev.quantity);
        const prix = name === "prixUnitaire" ? Number(value) : Number(prev.prixUnitaire);
        updated.totalprice = qty * prix;
      }
      return updated;
    });
  };

  useEffect(() => {
    if (selectedProduit) {
      setVente(prev => {
        const qty = Number(prev.quantity) || 0;
        const prix = selectedProduit.price || 0;
        return {
          ...prev,
          stockId: selectedProduit.value,
          prixUnitaire: prix,
          totalprice: qty * prix,
          posId: selectedProduit.posId,
          distributeurId: selectedProduit.distributeurId,
          posNom: selectedProduit.posNom,
          regionId: selectedProduit.regionId,
          regionNom: selectedProduit.regionNom,
          distributeurNom: selectedProduit.distributeurNom,
        };
      });
    }
  }, [selectedProduit]);

  const handleSearch = useCallback( debounce((inputValue) => {
    if (inputValue.length >= 2) {
      fetch(`http://localhost:8005/api/stock_produit/stock/search?keyword=${inputValue}&identifiant=${identifiant}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) {
          console.error("La réponse n'est pas un tableau:", data);
          setProduitOptions([]);
          return;
        } 
          const mapped = data.map(p => ({
            value: p.stockId,
            label: `${p.nomstock} - ${p.produitNom} (Stock: ${p.quantity}) - ${p.regionNom} - ${p.posNom} - ${p.distributeurNom}`,
            price: p.prixUnitaire,
            regionNom: p.regionNom,
            posNom: p.posNom,
            posId: p.posId,
            regionId: p.regionId,
            distributeurId: p.distributeurId,
            distributeurNom: p.distributeurNom,
          }));
          setProduitOptions(mapped);
        })
        .catch(err => console.error("Erreur recherche produit:", err));
         setProduitOptions([]);
    }
  },300), [identifiant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        stockId: vente.stockId,
        quantity: Number(vente.quantity),
        note: vente.note,
        regionId: selectedProduit?.regionId ?? vente.regionId ?? null,
        distributeurId: selectedProduit?.distributeurId ?? vente.distributeurId ?? null,
        posId: selectedProduit?.posId ?? vente.posId ?? null,
        identifiant: vente.identifiant,
        prixUnitaire: Number(vente.prixUnitaire),
      };
      console.log("ID envoyé :", id);
      console.log(payload);
      await axios.put(`http://localhost:8005/api/vente/modifier/${id}`, payload,  {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
      alert("Vente modifiée avec succès");
      navigate("/dashboard/vente");
    } catch (error) {
      const msg = error.response?.data?.message || 'Erreur lors de la modification de la vente';
      setErrorMsg(msg);
      console.error(msg);
      alert(msg);
    }
  };

  return (
    <div>
      <div className='fixed left-0 z-10'><SidebarLayout /></div>
      <div
        className="relative z-20 flex min-h-screen flex-col ml-44 overflow-x-hidden"
        style={{
          '--select-button-svg': "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(106,117,129)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
          fontFamily: 'Inter, "Noto Sans", sans-serif'
        }}
      >
        <form onSubmit={handleSubmit}>
          {errorMsg && (
            <div className="text-red-600 font-semibold mb-4 px-4">
              {errorMsg}
            </div>
          )}
          <div className="sm:ml-72 layout-container flex h-full grow flex-col">
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col min-w-[400px] flex-1">
                <div className="flex flex-wrap justify-between gap-3 p-8">
                  <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Modifier une vente</p>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Produit *</p>
                    <Select
                      options={produitOptions}
                      value={selectedProduit}
                      onChange={setSelectedProduit}
                      onInputChange={handleSearch}
                      isSearchable
                      isClearable
                    />
                  </label>
                </div>

                <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4">
                  Prix Unitaire: <span>{vente.prixUnitaire ? vente.prixUnitaire.toFixed(2) : "0.00"}</span>
                </p>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Distributeur*</p>
                    <select
                      name="distributeurId"
                      value={vente.distributeurId}
                      onChange={handleChange}
                      readOnly
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                    >
                      <option value={vente.distributeurId || ""}>{vente.distributeurNom}</option>
                    </select>
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Region</p>
                    <select
                      name="regionId"
                      value={vente.regionId}
                      onChange={handleChange}
                      readOnly
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                    >
                      <option value={vente.regionId || ""}>{vente.regionNom}</option>
                    </select>
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Point de vente*</p>
                    <select
                      name="posId"
                      value={vente.posId}
                      onChange={handleChange}
                      readOnly
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                    >
                      <option value={vente.posId || ""}>{vente.posNom}</option>
                    </select>
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Quantité</p>
                    <input
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                      value={vente.quantity}
                      type="number"
                      onChange={handleChange}
                      name="quantity"
                    />
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#121416] text-base font-medium leading-normal pb-2">Note Optionnelle</p>
                    <textarea
                      name="note"
                      value={vente.note}
                      onChange={handleChange}
                      placeholder="Ajouter des détails supplémentaires sur la vente"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] min-h-36 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                    ></textarea>
                  </label>
                </div>

                <div className='font-bold text-xl px-4'>
                  Le prix total : <span className='text-red-500'>{vente.totalprice ? vente.totalprice.toFixed(2) : "0.00"} MAD</span>
                </div>

                <div className="flex justify-stretch">
                  <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                    <button
                      type="submit"
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#417dbd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Enregistrer la Vente</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard/vente")}
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

export default ModifierVente;
