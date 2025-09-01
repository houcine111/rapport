import SidebarLayout from '../../layouts/sidebar.jsx';

const OfflineMode = () => {
  return (
    <div>
        <div className='fixed left-0 z-10'><SidebarLayout /></div>
         <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="sm:ml-64 layout-content-container flex flex-col min-w-[350px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-8"><p className="text-[#121416] tracking-light text-[32px] font-bold leading-tight min-w-72">Mode hors ligne</p></div>
            <div className="flex items-center gap-4 bg-white px-4 min-h-[72px] py-2">
              <div className="text-[#121416] flex items-center justify-center rounded-lg bg-[#f1f2f4] shrink-0 size-12" data-icon="WifiSlash" data-size="24px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                  <path
                    d="M213.92,210.62a8,8,0,1,1-11.84,10.76l-52-57.15a60,60,0,0,0-57.41,7.24,8,8,0,1,1-9.42-12.93A75.43,75.43,0,0,1,128,144c1.28,0,2.55,0,3.82.1L104.9,114.49A108,108,0,0,0,61,135.31,8,8,0,0,1,49.73,134,8,8,0,0,1,51,122.77a124.27,124.27,0,0,1,41.71-21.66L69.37,75.4a155.43,155.43,0,0,0-40.29,24A8,8,0,0,1,18.92,87,171.87,171.87,0,0,1,58,62.86L42.08,45.38A8,8,0,1,1,53.92,34.62ZM128,192a12,12,0,1,0,12,12A12,12,0,0,0,128,192ZM237.08,87A172.3,172.3,0,0,0,106,49.4a8,8,0,1,0,2,15.87A158.33,158.33,0,0,1,128,64a156.25,156.25,0,0,1,98.92,35.37A8,8,0,0,0,237.08,87ZM195,135.31a8,8,0,0,0,11.24-1.3,8,8,0,0,0-1.3-11.24,124.25,124.25,0,0,0-51.73-24.2A8,8,0,1,0,150,114.24,108.12,108.12,0,0,1,195,135.31Z"
                  ></path>
                </svg>
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-[#121416] text-base font-medium leading-normal line-clamp-1">Mode hors ligne</p>
                <p className="text-[#6a7581] text-sm font-normal leading-normal line-clamp-2">Votre application est actuellement hors ligne. Les modifications seront synchronisées lorsque la connexion sera rétablie.</p>
              </div>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#417dbd] text-white text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Synchroniser maintenant</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default OfflineMode;
