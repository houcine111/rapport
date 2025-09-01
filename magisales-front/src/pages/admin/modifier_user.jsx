import React, { useState, useEffect } from 'react';
import { useParams ,useNavigate } from 'react-router-dom';
import SidebarLayout from '../../layouts/sidebar.jsx';

const Modifyuser = () => {
  const token = localStorage.getItem("token");
  const [errorMsg, setErrorMsg] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
const [user, setUser] = useState({
   identifiant: "",
    fullname: "",
    password: "",
    region: "",
    distributeur: "",
    
    pos: "",
    role: "",
    active: true,
});
const [regions, setRegions] = useState([]);
const [distributeurs, setDistributeurs] = useState([]);
const [Pos, setPoss] = useState([]);
const handleChange = (e) => {
  const { name, value } = e.target;
  setUser((prevUser) => ({
    ...prevUser,
    [name]: value,
  }));
};
useEffect(() => {
  fetch(`http://localhost:8005/api/users/${id}`,{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  })
    .then((res) => res.json())
.then((data) => {
      const { password, region, distributeur, pos, ...userWithoutPassword } = data; 
        setUser({
        ...userWithoutPassword,
        password: "",
        region: region?.region || "",
        distributeur: distributeur?.distributeur || "",
        pos: pos?.pos || "",
      });
    })    .catch((err) => console.error(err));
}, [id]);
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
 const handleFreeze = () => {
  const newActiveStatus = !user.active; 

  const message = newActiveStatus
    ? "Voulez-vous vraiment activer cet utilisateur ?"
    : "Voulez-vous vraiment geler cet utilisateur ?";

  if (window.confirm(message)) {
    fetch(`http://localhost:8005/api/freeze/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
     },
      body: JSON.stringify({ active: newActiveStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de la mise à jour");
        alert(newActiveStatus ? "Utilisateur activé avec succès !" : "Utilisateur gelé avec succès !");
        
        setUser((prevUser) => ({
          ...prevUser,
          active: newActiveStatus,
        }));
      })
      .catch((err) => alert(err.message));
  }
};
const handleSave = async (e) => {
  e.preventDefault();
  try {
      const dataToSend = {
      identifiant: user.identifiant,
      fullname: user.fullname,
      password: user.password || undefined, 
      role: user.role,
      region: user.role === "ADMIN" ? null : user.region,
      distributeur: user.role === "ADMIN" ? null : user.distributeur,
      pos: user.role === "ADMIN" ? null : user.pos,
      active: user.active,
    };
     Object.keys(dataToSend).forEach(
      (key) => dataToSend[key] === undefined && delete dataToSend[key]
    );
      //console.log("dataToSend:", dataToSend);
    if (!dataToSend.password) {
      delete dataToSend.password; 
    }
    const response = await fetch(`http://localhost:8005/api/user/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
     },
      body: JSON.stringify(dataToSend),
    });
    if (response.ok) {
      alert('Utilisateur modifié avec succès');
      navigate('/dashboard');
    }
  } catch (error) {
    const msg = error.response.data.message || 'Erreur lors de la modification de l’utilisateur';
    setErrorMsg(msg);
    console.error(msg);
    alert(msg);
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

      <div className="layout-container sm:ml-64 flex h-full grow flex-col">
       <header className="flex items-center justify-between whitespace-nowrap m-3 border-b border-solid border-b-[#f1f2f4] px-10 py-1">
  <div></div> 
  
  <div className="flex items-center space-x-2">
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="#6a7581"
      viewBox="0 0 24 24"
      className="w-6 h-6"
    >
      <path d="M12 2a5 5 0 100 10 5 5 0 000-10zm0 12c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5z" />
    </svg>
    <span className="text-base font-medium text-[#121416]">Admin</span>
   
  </div>
</header>
<form onSubmit={handleSave}>
    {errorMsg && (
      <div className="text-red-600 font-semibold mb-4 px-4">
        {errorMsg}
      </div>
    )}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5  flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#121416]  tracking-light text-lg lg:text-4xl font-bold leading-tight min-w-72">Modifier un utilisateur</p></div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Nom complet</p>
                <input name='fullname'
                  placeholder="Entrez le nom complet" value={user?.fullname || ''} onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Identifiant</p>
                <input  name='identifiant'
                  placeholder="Entrez l'identifiant"
                  value={user?.identifiant || ''} onChange={handleChange}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                 
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Mot de passe</p>
                <input name='password'type='password'  value={user.password} onChange={handleChange}
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
                <select name='distributeur' value={user.distributeur} onChange={handleChange}
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
                  name='region' value={user.region} onChange={handleChange}
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
            <label className='text-red-400 text-sm'>vous voulez geler cet utilisateur</label>
             <button  onClick={() => handleFreeze()}
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
                   <span>{user.active ? "Geler" : "Dégeler"}</span>
                </button>
            <div className="flex justify-stretch">
              <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                <button type='button' onClick={() => navigate('/dashboard')}
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
      </form>
      </div>
    </div>
    </div>
    )
};
export default Modifyuser;