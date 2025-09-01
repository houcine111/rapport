import React, { useState } from 'react';

const ExportVente = ({ identifiant }) => {
  const [isExporting, setIsExporting] = useState(false);
  const token=localStorage.getItem("token");
  const handleExportVentes = async () => {
    setIsExporting(true);
    if (!token) {
      alert("Vous devez être connecté");
      return;
    }
    try {
     
      const exportUrl = `http://localhost:8005/api/vente/exportvente?identifiant=${encodeURIComponent(identifiant)}`;
       const response = await fetch(exportUrl, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          
        },
      });
       if (!response.ok) throw new Error('Échec du téléchargement');
        const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);
         const link = document.createElement('a');
      link.href = url;
      link.download = 'ventes.xlsx';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
        setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    
    } catch (error) {
      console.error('Vente export failed:', error);
      alert('Échec de l\'exportation des ventes');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportVentes}
      disabled={isExporting}
      className="bg-green-500 text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
    >
      {isExporting ? 'Export en cours...' : 'Exporter '}
    </button>
  );
};

export default ExportVente;