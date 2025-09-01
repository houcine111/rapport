import React, { useEffect, useState } from "react";
import SidebarLayout from "../../layouts/sidebar.jsx";
import axios from "axios";
import * as XLSX from "xlsx";
import SearchAndFilter from '../../components/searchandfiltre.jsx';


const StockCarrefour = () => {
  const token=localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [posColumns, setPosColumns] = useState([]);
  const [file, setFile] = useState(null);
  const [filteredstock, setFilteredstock] = useState([]);
 const [posColors, setPosColors] = useState({}); 
const [visiblePosColumns, setVisiblePosColumns] = useState([]);
  const colorsPalette = [
  "#FFA07A", // saumon clair
  "#90EE90", // vert clair
  "#87CEFA", // bleu clair
  "#FFFACD", // jaune clair
  "#D8BFD8", // violet clair
  "#FFDAB9", // pêche clair
  "#40E0D0", // turquoise clair
];

 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
const handleImport = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

       if (jsonData.length < 2) {
          setError("Excel file is empty or has no data rows");
          return;
        }

      const headers = jsonData[0];
      const rows = jsonData.slice(1).map(row => {
        const quantites = {};

          const nomProduit = row[headers.indexOf("nomProduit")];
          const nomStock = row[headers.indexOf("nomStock")];
          const barcode = row[headers.indexOf("barcode")];
          const codeInterne = row[headers.indexOf("codeInterne")];
          const prixUnitaire = row[headers.indexOf("prixUnitaire")];
        

        for (let i = 5; i < row.length; i++) {
          if (row[i] !== undefined && row[i] !== null) {
            quantites[headers[i]] = Number(row[i]);
          }
        }

        return {
           nomProduit,
            nomStock,
            barcode,
            codeInterne,
            prixUnitaire: Number(prixUnitaire),
            quantites,
            
        };
      });
const distributorName = "Carrefour";

      axios.post(`http://localhost:8005/api/import/stock_produit/${encodeURIComponent(distributorName)}`, rows, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json" // si rows est un JSON
    }
  })
        .then(() => {
          alert("Import terminé avec succès !");
         // console.log(rows);
          setData(rows); 
        })
        
        .catch(err => {
          alert("Erreur lors de l'importation :", err.response ? err.response.data : err.message);
          console.error(err);
        });
    };
    reader.readAsBinaryString(file);
  };
useEffect(() => {
  const getproduitstocks = async () => {
    try{
     const distributeur = "Carrefour"; 
        const response = await axios.get(
          `http://localhost:8005/api/stock_produit/getproduit_stock/${encodeURIComponent(distributeur)}`
        ,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
        //console.log(response.data);
      const stocks = response.data;

       const grouped = {};
      stocks.forEach(item => {
        const key = `${item.produitId}-${item.nomStock}`;
        if (!grouped[key]) {
          grouped[key] = {
            ...item,
            quantites: { ...item.quantites },
            regionParPos: { ...item.regionParPos }
          };
        } else {
          
          grouped[key].quantites = { ...grouped[key].quantites, ...item.quantites };
          grouped[key].regionParPos = { ...grouped[key].regionParPos, ...item.regionParPos };
        }
      });
       const allPos = new Set();
      Object.values(grouped).forEach(stock => {
        Object.keys(stock.quantites).forEach(pos => allPos.add(pos));
      });
     
      const posArray = Array.from(allPos);
      setPosColumns([...allPos]);
        setData(Object.values(grouped));
      setFilteredstock(Object.values(grouped));
      setVisiblePosColumns(Array.from(allPos)); // <- afficher toutes les colonnes POS par défaut

         const mapping = {};
        posArray.forEach((pos, idx) => {
          mapping[pos] = colorsPalette[idx % colorsPalette.length];
        });
        setPosColors(mapping);
    }catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      setError("Erreur lors de la récupération des produits");
  }
}
getproduitstocks();
  }, []);
  const posToRegion = {};
data.forEach(row => {
  if (row.regionParPos) {
    Object.entries(row.regionParPos).forEach(([pos, region]) => {
      posToRegion[pos] = region; 
    });
  }
});
const handleFilter = (filters) => {
  let result = [...data];
  const normalize = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  if (filters.search) {
    const search = normalize(filters.search);

    result = result.filter((u) =>
      (u.nomProduit && normalize(u.nomProduit).includes(search)) ||
      (u.nomStock && normalize(u.nomStock).includes(search)) ||
      (u.pos && normalize(u.pos).includes(search)) ||
      (u.regionParPos && Object.values(u.regionParPos).some(r => normalize(r).includes(search)))
    );
  }

  // toujours montrer toutes les POS
  setVisiblePosColumns(posColumns);

  if (filters.region) {
    result = result.filter((u) => 
      Object.values(u.regionParPos).some(r => r === filters.region)
    );
  }
  if (filters.distributeur) {
    result = result.filter((u) => u.distributeur === filters.distributeur);
  }
  if (filters.pos) {
    result = result.filter((u) => u.pos === filters.pos);
  }

  setFilteredstock(result);
};



  return (
    <div className="p-14">
      <div className="fixed left-0 top-0 right-0 z-10">
        <SidebarLayout />
      </div>
 <div className="relative flex-1  min-h-screen flex-col  overflow-x-hidden pt-10" style={{
    '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
    fontFamily: `"Inter", "Noto Sans", sans-serif`
  }}>
      <div className="relative flex min-h-screen flex-col pt-10 overflow-x-auto  min-w-[400px]">
        <div className="flex min-w-72 flex-col  p-4">
          <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight">
            Stock Carrefour
          </p>
          <div className="space-x-3">
           <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="my-2 " />
          <button onClick={handleImport} className="bg-[#f1f2f4] px-2 py-2 rounded-full text-sm font-medium w-32">
            Importer Excel
          </button>
          </div>
         
        </div>
        
         <div>
          <SearchAndFilter  onFilter={handleFilter}     />
        </div>
        <div className=" py-3 overflow-x-auto   overflow-y-auto">
        <div className="flex min-w-[2000px]  w-full overflow-hidden rounded-xl border border-[#dde0e3] bg-white ">
        <table className="border-collapse border border-gray-300 w-full text-left min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Distributeur</th>
              <th className="border p-2">Produit</th>
              <th className="border p-2">Nom stock</th>
              <th className="border p-2">Barcode</th>
              <th className="border p-2">Code interne</th>
              <th className="border p-2">Prix unitaire</th>
              {visiblePosColumns.map((pos, idx) => (
                <th key={idx} className="border p-2" style={{ backgroundColor: posColors[pos] }}>
                      {posToRegion[pos] ? `${pos} (${posToRegion[pos]})` : pos}
                    </th>
              ))}
            </tr>
          </thead>
       <tbody>
  {filteredstock.length === 0 ? (
    <tr>
      <td colSpan={10} className="text-center py-4">
        Aucun stock trouvé.
      </td>
    </tr>
  ) : (
    filteredstock.map((row, i) => (
      <tr key={i}>
        <td className="border p-2">{row.distributeur}</td>
        <td className="border p-2">{row.nomProduit}</td>
        <td className="border p-2">{row.nomStock}</td>
        <td className="border p-2">{row.barcode}</td>
        <td className="border p-2">{row.codeInterne}</td>
        <td className="border p-2">{row.prix}</td>
        {visiblePosColumns.map((pos, idx) => (
          <td key={idx} className="border p-2 text-center"
                          style={{ backgroundColor: row.quantites && row.quantites[pos] > 0 ? posColors[pos] : "transparent" }}>
                          {row.quantites ? row.quantites[pos] || "x" : "x"}
                        </td>
        ))}
      </tr>
    ))
  )}
</tbody>

        </table>
        </div>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default StockCarrefour;
