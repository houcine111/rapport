import axios from 'axios';
import { addSale } from '../../dbindex/db.js';

export async function saveSale(sale) {
  if (!navigator.onLine) {
    await addSale(sale);
    alert("Vente enregistrée hors ligne");
    console.log("Vente sauvegardée hors ligne !");
    return { offline: true };
  }

  const response = await axios.post("http://localhost:8005/api/vente/ajouter", sale);
  return response.data;
}
