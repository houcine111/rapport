import React, { useState } from "react";

const ImportExport = ({ 
  importUrl, 
  exportUrl, 
  fileName = "export.xlsx", 
  onImportSuccess 
}) => {
  const [file, setFile] = useState(null);

  // 📥 Importation
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleImportFile = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier");
      return;
    }
  const token=localStorage.getItem("token")
  if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(importUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`

        },
      });
      if (response.ok) {
        const result = await response.json();
        alert(`${result.message} (${result.count} éléments ajoutés)`);
        if (onImportSuccess) onImportSuccess();
      } else {
        alert("Erreur lors de l'import");
      }
    } catch (error) {
      console.error("Erreur import :", error);
      alert("Erreur réseau");
    }
  };


 const handleExportFile = async () => {
  const token = localStorage.getItem("token");
     if (!token) {
      alert("Vous devez être connecté");
      return;
    }
  try {
     
    console.log("Attempting export with URL:", exportUrl);
    
    const response = await fetch(exportUrl,  {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
      });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Export failed: ${response.status} ${response.statusText}\n${errorData?.message || ''}`
      );
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
  } catch (error) {
    console.error("Export error:", error);
    alert(`Export failed: ${error.message}`);
  }
};

  return (
    <div className="block space-x-2 space-y-4 items-center">
      {/* Import */}
      {importUrl && (
        <>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="text-sm"
          />
          <button
            onClick={handleImportFile}
            className="bg-[#f1f2f4] px-2 py-2 rounded-full text-sm font-medium"
          >
            Importer
          </button>
        </>
      )}

      {/* Export */}
      {exportUrl && (
        <button
          onClick={handleExportFile}
          className="bg-green-500 text-white px-2 py-2 rounded-full text-sm font-medium "
        >
          Exporter
        </button>
      )}
    </div>
  );
};

export default ImportExport;
