import SidebarLayout from '../../layouts/sidebar.jsx';
const AddVente = () => {
  return (
    <div>
        <div className='fixed left-0 z-10'><SidebarLayout /></div>
       <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className=" sm:ml-64 layout-container flex h-full grow flex-col">
       
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] min-w-[400px] py-5  flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4"><p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Nouvelle vente</p></div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Produit Code/Bar-code</p>
                <input
                  placeholder="Enter code or scan"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Nom du produit</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Prix unitaire</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#121416] text-base font-medium leading-normal pb-2">Quantité</p>
                <input
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#121416] focus:outline-0 focus:ring-0 border border-[#dde0e3] bg-white focus:border-[#dde0e3] h-14 placeholder:text-[#6a7581] p-[15px] text-base font-normal leading-normal"
                  value=""
                />
              </label>
            </div>
           
            <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Total: $5.99</p>
            <div className="flex px-4 py-3 justify-center">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">➕ Ajouter</span>
              </button>
            </div>
            <h3 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Résumé de la vente</h3>
            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2 justify-between">
              <div className="flex flex-col justify-center">
                <p className="text-[#121416] text-base font-medium leading-normal line-clamp-1">1 x $5.99</p>
                <p className="text-[#6a7581] text-sm font-normal leading-normal line-clamp-2">Spray nettoyant écologique</p>
              </div>
              <div className="shrink-0"><p className="text-[#121416] text-base font-normal leading-normal">$5.99</p></div>
            </div>
            <p className="text-[#6a7581] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">Total en cours : $5.99</p>
            <div className="flex px-4 py-3">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#417dbd] text-white text-base font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Soumettre la vente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AddVente;
