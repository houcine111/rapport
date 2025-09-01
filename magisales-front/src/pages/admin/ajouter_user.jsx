import React, { useState, useEffect } from 'react';
import SidebarLayout from '../../layouts/sidebar.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddUser = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
  
  const [regions, setRegions] = useState([]);
  const [distributeurs, setDistributeurs] = useState([]);
  const [Pos, setPoss] = useState([]);

  const [user, setUser] = useState({
    identifiant: "",
    fullname: "",
    password: "",
    region: "",
    distributeur: "",
    
    pos: "",
    role: "",
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
    fetch("http://localhost:8005/api/add/distributeur/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  }) 
      .then((response) => response.json())
      .then((data) => {
        setDistributeurs(data); 
      })
      .catch((error) => console.error("Erreur fetch distributeurs:", error));
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
        setPoss(data); 
      })
      .catch((error) => console.error("Erreur fetch poss:", error));
  }, []);

   const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };  
  const [date, setDate] = useState('');
  useEffect(() => {
    const today=new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);
 const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log("data send",user)
      await axios.post('http://localhost:8005/api/register', user,{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  });
      //console.log("data:", user);
      alert('Utilisateur ajouté avec succès');
      navigate('/dashboard');
    } catch (error) {
    if (error.response && error.response.data) {
      const msg = error.response.data.message || 'Erreur lors de l’ajout de l’utilisateur';
      setErrorMsg(msg);
      console.error(msg);
      alert(msg);

    } else {
      
      console.error("Erreur inconnue:", error.message);
      alert('Erreur lors de l’ajout de l’utilisateur');
    }
  }
  };

    return (
        <div>
        <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
 style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}    >
      <div className='fixed  left-0 z-10'><SidebarLayout /></div>

      <div className="layout-container  flex h-full grow flex-col">
     
<form onSubmit={handleSubmit} className="">
  {errorMsg && (
  <div className="text-red-600 font-semibold mb-4 px-4">
    {errorMsg}
  </div>
)}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5  flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#121416]  tracking-light text-lg lg:text-4xl font-bold leading-tight min-w-72">Ajouter un utilisateur</p></div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Nom complet</p>
                <input name='fullname' value={user.fullname} onChange={handleChange}
                  placeholder="Entrez le nom complet"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Identifiant</p>
                <input name='identifiant' value={user.identifiant} onChange={handleChange}
                  placeholder="Entrez l'identifiant"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Mot de passe</p>
                <input name='password' value={user.password} onChange={handleChange}
                  placeholder="Entrez le mot de passe"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Role</p>
                <select name='role' value={user.role} onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">-- Choisir un rôle --</option>
                  <option value="ADMIN">Administrateur</option>
                  <option value="COMMERCIAL">Animateur</option>
                  <option value="SUPERVISEUR">Superviseur</option>
                  <option value="BACKOFFICE">Back-office</option>
                </select>
              </label>
            </div>
             <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Distributeur</p>
                <select name='distributeur' onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">Sélectionner un  distributeur</option>
                  {distributeurs.map((d) => (
                      <option key={d.id} value={d.distributeur}>
                        {d.distributeur}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Region</p>
                <select
                  name='region' onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                >
                  <option value="">-- Choisir une région --</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.region}>
                        {r.region}
                      </option>
                    ))}
                 
                </select>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">POS</p>
                <select name='pos' value={user.pos} onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14  placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                required={user.role === "COMMERCIAL"}>
                  <option value="">Sélectionner le POS</option>
                  {Pos.map((p) => (
                      <option key={p.id} value={p.pos}>
                        {p.pos}
                      </option>
                    ))}
                </select>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Date de début</p>
                <input
                  placeholder="Sélectionner la date de début"
                  value={date}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 readOnly
                />
              </label>
            </div>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button type="button" onClick={() => navigate('/dashboard')}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate"> Annuler</span>
                </button>
                <button
                  type='submit' className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#417dbd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate"> Enregistrer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
      </div>
    </div>
    </div>
    
    )
};
export default AddUser;