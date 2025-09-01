import { initDB } from '../../dbindex/db.js';
import SidebarLayout from '../../layouts/sidebar.jsx';
import React, { useEffect, useState } from 'react';
import { syncSales } from '../commercial/syncService.js';

const Sync = () => {
  const [unsyncedSales, setUnsyncedSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUnsyncedSales = async () => {
    const db = await initDB();
    const tx = db.transaction('sales', 'readonly');
    const store = tx.objectStore('sales');
    const allSales = await store.getAll();
    const notSynced = allSales.filter((sale) => !sale.isSynced);
    setUnsyncedSales(notSynced);
  };

  const handleSync = async () => {
    setLoading(true);
    await syncSales();
    await fetchUnsyncedSales();
    setLoading(false);
  };

  useEffect(() => {
    fetchUnsyncedSales();
  }, []);

  return (
    <div>
      <div className="fixed left-0 top-0 right-0 z-10">
        <SidebarLayout />
      </div>
      <div
        className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
        style={{
          '--select-button-svg': `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24px' height='24px' fill='rgb(106,117,129)' viewBox='0 0 256 256'%3e%3cpath d='M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,0,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z'%3e%3c/path%3e%3c/svg%3e")`,
          fontFamily: `"Inter", "Noto Sans", sans-serif`,
        }}
      >
        <div className=" sm:p-8 pt-10 layout-container flex h-full grow flex-col">
          <div className="px-16   py-5">
            <div className="layout-content-container flex flex-col min-w-[350px]">
              <div className="flex flex-wrap justify-between gap-3 p-4 ">
                <div className="flex min-w-72 flex-col gap-3 pt-4">
                  <p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight">
                    Ventes non synchronisées
                  </p>
                </div>
                <button
                  onClick={handleSync}
                  disabled={loading}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-medium leading-normal"
                >
                  {loading ? 'Synchronisation...' : 'Synchroniser'}
                </button>
              </div>

              <div className="py-3 overflow-x-auto max-h-[700px] overflow-y-auto">
                <div className="flex overflow-x-auto min-w-[900px]  rounded-xl border border-[#dde0e3] bg-white">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-white">
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          ID Vente
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Vendeur ID
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Stock ID
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Quantité
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Prix unitaire
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Total
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-[#121416] text-sm font-medium leading-normal">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {unsyncedSales.length === 0 ? (
                        <tr>
                          <td
                            colSpan={8}
                            className="text-center py-4 text-[#6a7581] text-sm font-normal"
                          >
                            Toutes les ventes sont synchronisées 🎉
                          </td>
                        </tr>
                      ) : (
                        unsyncedSales.map((sale) => (
                          <tr
                            key={sale.id}
                            className="border-t border-t-[#dde0e3] hover:bg-gray-50"
                          >
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.id || '-'}
                            </td>
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.identifiant || '-'}
                            </td>
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.stockId || '-'}
                            </td>
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.quantity}
                            </td>
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.prixUnitaire || '-'}
                            </td>
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.totalprice || '-'}
                            </td>
                            <td className="px-4 py-2 text-[#6a7581] text-sm font-normal">
                              {sale.date
                                ? new Date(sale.date).toLocaleString()
                                : '-'}
                            </td>
                            <td
                              className="px-4 py-2 text-[#6a7581] text-sm font-normal truncate max-w-xs relative group"
                              title={sale.note}
                            >
                              <span className="block truncate">
                                {sale.note || '-'}
                              </span>
                              {sale.note && (
                                <div className="absolute left-0 bottom-full mb-1 w-max max-w-xs bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-normal break-words">
                                  {sale.note}
                                </div>
                              )}
                            </td>
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
      </div>
    </div>
  );
};

export default Sync;
