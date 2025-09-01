import React from 'react';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
 import  {  getRole  } from '../components/decodeurtoken.js';

  

const LoginPage = () => {
    const [identifiant, setIdentifiant] = useState("");
  const [password, setPassword] = useState("");
   const navigate = useNavigate();
  async function login(e) {
  e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8005/api/login', { identifiant, password });

      
  const { token } = response.data;
   localStorage.setItem("token", token);
  const role = getRole(token);


   
    switch (role) {
        case "ADMIN":
          navigate("/dashboard");
          break;
        case "COMMERCIAL":
          navigate("/dashboard_commercial");
          break;
        case "SUPERVISEUR":
          navigate("/dashboard_superviseur");
          break;
          case "BACKOFFICE":
          navigate("/dashboard_backoffice");
          break;
        default:
          navigate("/");
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert("error de connexion");
      // Handle login failure (e.g., show an error message)
    }
} 
  return (
    <div
      className="relative flex size-full min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
    >
      <div className=" flex h-full grow flex-col">
        <header className="flex  border-b border-solid border-b-[#f0f2f5] px-10 py-3">
          <div className="flex items-center gap-4 text-[#111418]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
              Magi&apos;Sales Pro
            </h2>
          </div>
        </header>
      <form onSubmit={login}>
        <div className="px-2 md:px-40 flex flex-1 justify-center py-5 ">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5  flex-1">
            <h2 className="text-[#111418] tracking-light text-[28px] md:text-x font-bold leading-tight px-4 text-center pb-3 pt-5">
              Bienvenue
            </h2>

            {/* Email or ID */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2"> Identifiant</p>
                <input
                  type="text" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)}
                  placeholder="Entrer votre identifiant"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60748a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

            {/* Password */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#111418] text-base font-medium leading-normal pb-2">Mot de passe</p>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrer votre mot de passe"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-full text-[#111418] focus:outline-0 focus:ring-0 border border-[#dbe0e6] bg-white focus:border-[#dbe0e6] h-14 placeholder:text-[#60748a] p-[15px] text-base font-normal leading-normal"
                />
              </label>
            </div>

          

            {/* Log In Button */}
            <div className="flex  py-3">
              <button type="submit" 
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 flex-1 bg-[#0c77f2] text-white text-base font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">se connecter</span>
              </button>
            </div>
          </div>
        </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
