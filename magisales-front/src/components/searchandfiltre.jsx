import React, { useState, useEffect } from "react";
import { fr } from "date-fns/locale"; 
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import  { getIdentifiant, getRole } from './decodeurtoken.js';

const SearchAndFilter = ({ onSearch, onFilter, showSourceFilter = false ,showdistributeur=false ,showregionfilter=false,showdatefilter=false,showStatutFilter=false}) => {
  const token = localStorage.getItem("token");
  const role = getRole(token);
  const [regions, setRegions] = useState([]);
  const [distributeurs, setDistributeurs] = useState([]);
  const [posList, setPosList] = useState([]);
  const [source, setSource] = useState(["Internel", "platforme"]);
  const [Statut, setStatut] = useState(["Actif", "Inactif"]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    region: "",
    ville: "",
    distributeur: "",
    pos: "",
    source:"",
    startDate: null,
    endDate: null,
    statut: ""
  });

  useEffect(() => {
      if (!token) {
    console.warn("Pas de token trouvé !");
    return;
  }
    fetch("http://localhost:8005/api/add/region/all",{
    headers: {
       "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
     
    }
  })
      .then((res) => res.json())
      .then((data) => setRegions(data))
      .catch((err) => console.error("Erreur fetch regions:", err));

    fetch("http://localhost:8005/api/add/distributeur/all",{
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
      .then((res) => res.json())
      .then((data) => setDistributeurs(data))
      .catch((err) => console.error("Erreur fetch distributeurs:", err));

    fetch("http://localhost:8005/api/add/pos/all",{
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  })
      .then((res) => res.json())
      .then((data) => setPosList(data))
      .catch((err) => console.error("Erreur fetch pos:", err));
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);

    if (name === "search" && onSearch) {
      onSearch(value);
    } else if (onFilter) {
      onFilter(updatedFilters);
    }
  };
useEffect(() => {
  const updatedFilters = { ...filters, startDate, endDate };
  setFilters(updatedFilters);
  if (onFilter) {
    onFilter(updatedFilters);
  }
}, [startDate, endDate]);
  return (
    
    <div className=" flex flex-wrap   gap-3 sm:w-full  w-auto">
      <input
        type="text"
        name="search"
        placeholder="Rechercher..."
        className="flex h-8  shrink-0  w-auto  justify-center rounded-full bg-[#f0f2f5] p-5 "
        value={filters.search}
        onChange={handleChange}
      />
      {showregionfilter && (role==="ADMIN" || role==="SUPERVISEUR") && (
        <select 
          name="region"
          value={filters.region}
          onChange={handleChange}
                  className="h-10 w-auto text-center  gap-x-2 rounded-full bg-[#f0f2f5]  pl-4 pr-2"
        >
          <option value=""> Région</option>
          {regions.map((r) => (
            <option key={r.id} value={r.region}>
              {r.region}
            </option>
          ))}
        </select>
      )}
         {(showdistributeur && (role==="ADMIN" || role==="SUPERVISEUR")) && (
        <select
          name="distributeur"
          value={filters.distributeur}
          onChange={handleChange}
                  className=" h-10 text-center w-auto rounded-full bg-[#f0f2f5]"
        >
          <option value=""> distributeur</option>
          {distributeurs.map((d) => (
            <option key={d.id} value={d.distributeur ||d.id}>
              {d.distributeur}
            </option>
          ))}
        </select>
         )}

         {(showSourceFilter && role==="ADMIN") && (
        <select
          name="source"
          value={filters.source}
          onChange={handleChange}
          className="h-10 text-center w-auto rounded-full bg-[#f0f2f5]"
        >
          <option value="">Source</option>
          {source.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
       {(showStatutFilter && role==="ADMIN") && (
        <select
          name="statut"
          value={filters.statut}
          onChange={handleChange}
          className="p-2 text-center w-auto rounded-full bg-[#f0f2f5]"
        >
          <option value="">Statut</option>
          {Statut.map((s, i) => (
            <option key={i} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}
      {showdatefilter  && (
        <div className="flex items-center w-auto rounded-xl sm:flex  space-x-2 ">
      <DatePicker
      locale={fr}
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        placeholderText="Date début"
        className="border p-2  rounded-full"
      />
      <DatePicker
        locale={fr}
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        placeholderText="Date fin"
        className="border p-2 rounded-full"
      />
    </div>
      )}
      </div>
    
    
  );
};

export default SearchAndFilter;
