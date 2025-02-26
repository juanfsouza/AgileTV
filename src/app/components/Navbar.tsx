"use client";

import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { ShimmerButton } from "./ui/shimmer-button";
export default function Header() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(currentScrollY < lastScrollY);
      setIsAtTop(currentScrollY === 0);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Função para rolar suavemente até a seção desejada
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false); // Fecha o menu mobile após clicar
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${isAtTop ? "bg-transparent" : "bg-zinc-950/20 backdrop-blur-sm"}`}
    >
      <div className="container mx-auto flex justify-between items-center p-4 md:p-6">
        <h1 className="hidden md:block text-2xl md:text-3xl font-bold text-yellow-400">
          CodeJF
        </h1>
        {/* Ícone do Menu Mobile */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}text-[rgba(255,255,255,0.64)]text-[rgba(255,255,255,0.45)]text-[rgba(194,194,194,0.45)]text-[rgba(255,255,255,0.45)]text-[rgba(255,255,255,0.45)]text-[rgba(255,255,255,0.79)]text-[rgba(255,255,255,0.87)]text-[rgba(255,255,255,0.87)]text-[rgba(255,255,255,0.97)]
        </button>

        {/* Navegação Desktop */}
        <nav className="hidden md:flex">
          <ul className="flex space-x-10 font-bold">
            <li className="group relative">
              <button
                onClick={() => scrollToSection("home")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Inicio
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative">
              <button
                onClick={() => scrollToSection("about")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Sobre
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative">
              <button
                onClick={() => scrollToSection("projects")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Projetos
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative">
              <button
                onClick={() => scrollToSection("contacts")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Contato
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </nav>

        {/* Botão Desktop */}
        <ShimmerButton className="shadow-2xl">
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-sm">
            Fale Comigo
          </span>
        </ShimmerButton>
      </div>

      {/* Menu Mobile (Overlay) */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black bg-opacity-80 flex flex-col items-center justify-center space-y-8 text-white transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-6 right-6 text-white text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          <FaTimes />
        </button>

        <ul className="text-center text-2xl font-bold space-y-6">
          <li>
            <button onClick={() => scrollToSection("about")} className="hover:text-yellow-400">
              Sobre
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("projects")} className="text-slate-300 hover:text-white transition-all">
              Projetos
            </button>
          </li>
          <li>
            <button onClick={() => scrollToSection("contacts")} className="text-slate-300 hover:text-white transition-all">
              Contatos
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
}