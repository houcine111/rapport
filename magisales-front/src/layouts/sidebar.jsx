import React, { useState ,useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import  { getIdentifiant, getRole } from '../components/decodeurtoken';
export default function SidebarLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const identifiant = token ? getIdentifiant(token) : null;
  const role = token ? getRole(token) : null;

const logout=() => {
  localStorage.removeItem("token");
   localStorage.removeItem("role");
    localStorage.removeItem("identifiant");
  navigate("/");
}
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
    <div className="flex flex-row-reverse  justify-between w-auto">  
      <header className="  flex items-start justify-end flex-1 whitespace-nowrap  px-10 py-2">

  <div className="flex items-center space-x-2  justify-end ">
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
    <span className="text-base font-medium text-[#121416]">{identifiant}</span>
   
  </div>
</header>
    <div className="flex ">
      {/* Sidebar */}
      <div
        className={` 
          fixed top-0 left-0  z-40 h-screen w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out
          ${isOpen  ? 'translate-x-0' : '-translate-x-full'} 
        `}
      >
        <div className="flex flex-col h-full justify-between  p-4">
          {/* Sidebar Content */}
          <div>
            <div className="flex items-center gap-4 text-[#121416] mb-5">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#121416] text-lg font-bold leading-tight tracking-[-0.015em]">Magi'Sales Pro</h2>
          </div>
            <ul className="space-y-4">
              <li>
                {role === "ADMIN" && (
  <Link
    to="/dashboard"
    className="text-gray-700 hover:text-blue-500 flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
      <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
    </svg>
    <span>Tableau de Bord</span>
  </Link>
)}

{role === "COMMERCIAL" && (
  <Link
    to="/dashboard_commercial"
    className="text-gray-700 hover:text-blue-500 flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
      <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
    </svg>
    <span>Tableau de Bord</span>
  </Link>
)}
{role === "SUPERVISEUR" && (
  <Link
    to="/dashboard_superviseur"
    className="text-gray-700 hover:text-blue-500 flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
      <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
    </svg>
    <span>Tableau de Bord</span>
  </Link>
)}

              </li>
              <li>
                {role === "ADMIN" && (
                <Link to="/dashboard/produits" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" />
                  </svg>
                  <span>Produits</span>
                </Link>
                )}
              </li>
              <li>
                <Link to="/dashboard/stock" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M240,184h-8V57.9l9.67-2.08a8,8,0,1,0-3.35-15.64l-224,48A8,8,0,0,0,16,104a8.16,8.16,0,0,0,1.69-.18L24,102.47V184H16a8,8,0,0,0,0,16H240a8,8,0,0,0,0-16ZM40,99,216,61.33V184H192V128a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v56H40Zm136,53H80V136h96ZM80,168h96v16H80Z" />
                  </svg>
                  <span>Stock</span>
                </Link>
              </li>
              <li>
                {role === "ADMIN" && (
                <Link to="/dashboard/stock_asawak" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" />
                  </svg>
                  <span>Stock Aswak</span>
                </Link>
                )}
              </li>
               <li>
                {role === "ADMIN" && (
                <Link to="/dashboard/stock_carrefour" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M223.68,66.15,135.68,18a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32l80.34,44-29.77,16.3-80.35-44ZM128,120,47.66,76l33.9-18.56,80.34,44ZM40,90l80,43.78v85.79L40,175.82Zm176,85.78h0l-80,43.79V133.82l32-17.51V152a8,8,0,0,0,16,0V107.55L216,90v85.77Z" />
                  </svg>
                  <span>Stock Carrefour</span>
                </Link>
                )}
              </li>
{/*
                <li>
                {role === "ADMIN" && (
                <Link to="/dashboard/couverture" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" stroke-width="16"/>
                <path d="M128 128V64a64 64 0 0 1 64 64z" fill="currentColor"/>
                <rect x="72" y="144" width="16" height="48" rx="2"/>
                <rect x="104" y="128" width="16" height="64" rx="2"/>
                <rect x="136" y="112" width="16" height="80" rx="2"/>
              </svg>
                  <span>Couverture</span>
                </Link>
                )}
              </li>
              */}
              <li>
                <Link to="/dashboard/vente"  className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M152,120H136V56h8a32,32,0,0,1,32,32,8,8,0,0,0,16,0,48.05,48.05,0,0,0-48-48h-8V24a8,8,0,0,0-16,0V40h-8a48,48,0,0,0,0,96h8v64H104a32,32,0,0,1-32-32,8,8,0,0,0-16,0,48.05,48.05,0,0,0,48,48h16v16a8,8,0,0,0,16,0V216h16a48,48,0,0,0,0-96Zm-40,0a32,32,0,0,1,0-64h8v64Zm40,80H136V136h16a32,32,0,0,1,0,64Z" />
                  </svg>
                  <span>Ventes</span>
                </Link>
              </li>
              <li>
                {(role === "ADMIN" || role === "SUPERVISEUR") && (
                <Link to="/dashboard/declarations" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M88,96a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H96A8,8,0,0,1,88,96Zm8,40h64a8,8,0,0,0,0-16H96a8,8,0,0,0,0,16Zm32,16H96a8,8,0,0,0,0,16h32a8,8,0,0,0,0-16ZM224,48V156.69A15.86,15.86,0,0,1,219.31,168L168,219.31A15.86,15.86,0,0,1,156.69,224H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H152V160a8,8,0,0,1,8-8h48V48H48Zm120-40v28.7L196.69,168Z" />
                  </svg>
                  <span>Déclarations</span>
                </Link>
                  )}
              </li>
               <li>
                {role === "COMMERCIAL" && (
                <Link to="/dashboard_commercial/offline_mode" className="flex items-center gap-2 text-gray-700 hover:text-blue-500 hover:bg-gray-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 .34-.03.67-.08 1h2.02c.05-.33.06-.66.06-1 0-4.42-3.58-8-8-8zm-6 7c0-.34.03-.67.08-1H4.06c-.05.33-.06.66-.06 1 0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6z"/>
                </svg>
                  <span>Sync vente</span>
                </Link>
                )}
              </li>
            
            </ul>
          </div>

          {/* Logout at bottom */}
          <div className="text-gray-700 hover:text-red-500 cursor-pointer p-2 flex items-center gap-2  rounded-full hover:bg-gray-100" onClick={logout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"
                      ></path>
                    </svg>
            <span>Logout</span>
          </div>
        </div>
       
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="  ">
        {/* Toggle button for mobile */}
        <button
          className=" mb-4 inline-flex items-center bg-transparent hover:bg-gray-100 hover:border-transparent hover:text-black focus:outline-none   rounded-xl p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
      className="h-6 w-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
        </button>

      
      </div>
    </div>
    </div>
    </div>
  );
}
