import axios from 'axios';
import { getUnsyncedSales, markSaleSynced } from '../../dbindex/db.js';

export async function syncSales() {
  if (!navigator.onLine) {
    alert("Pas de connexion internet");
    return;
  }

  const unsynced = await getUnsyncedSales();

  for (const sale of unsynced) {
    try {
      await axios.post("http://localhost:8005/api/vente/ajouter", sale);
      await markSaleSynced(sale.id);  
    } catch (error) {
      console.error("Erreur sync:", error);
    }
  }
  alert("Synchronisation terminée !");
}
