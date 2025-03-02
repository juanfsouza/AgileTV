"use client";

import { useState, useEffect, Key } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMyListStore, useUserStore } from "../store/useMylistStore";

export default function Header() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { user, setUser } = useUserStore();
  const { myList, setMyList } = useMyListStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  

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

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    }

    fetchUser();
  }, [setUser]);

  useEffect(() => {
    async function fetchMyList() {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await fetch("/api/mylist/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setMyList(data);
      }
    }
  
    fetchMyList();
  }, [user]);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } ${isAtTop ? "bg-transparent" : "bg-zinc-950/30 backdrop-blur-sm"}`}
    >
      <div className="container mx-auto flex justify-between items-center p-4 md:p-6 text-lg font-bold antialiased">
        {/* Logo (visível apenas no desktop) */}
        <div className="hidden md:block">
          <Image src="/logo.png" width={150} height={150} alt="Logo" />
        </div>

        {/* Ícone do Menu Mobile */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navegação Central (Desktop) */}
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
                onClick={() => scrollToSection("movies")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Filems
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative">
              <button
                onClick={() => scrollToSection("series")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Series
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
            <li className="group relative">
              <button
                onClick={() => scrollToSection("footer")}
                className="text-slate-300 hover:text-white transition-all"
              >
                Contatos
              </button>
              <span className="absolute bottom-0 left-0 h-1 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </li>
          </ul>
        </nav>

        {/* Avatar / Nome do Usuário */}
        <div className="relative">
          {user ? (
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2 text-white px-4 py-2 rounded-md transition-all"
            >
              <div className="w-10 h-10 flex items-center justify-center bg-zinc-800 text-white font-bold rounded-full">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name}</span>
            </button>
          ) : (
            <button
              className="text-slate-300 hover:text-white transition-all"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </button>
          )}

          {/* Menu Dropdown */}
          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute mt-2 w-44 md:w-72 bg-zinc-800 rounded-md shadow-lg overflow-hidden z-50"
              >
                <p className="px-4 py-2 text-white font-bold border-b border-gray-700 text-center">
                  Minha Lista
                </p>

                {isLoading ? (
                  <p className="px-4 py-2 text-white">Carregando...</p>
                ) : myList.length > 0 ? (
                  myList.map((item: { id: Key | null | undefined; tvShow: 
                    { title: string;
                      imageUrl: string;
                    }; 
                  }) => (                     
                    <div
                      key={item.id}
                      className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4 m-3">
                        {/* Exibir a imagem do filme/série */}
                        <img
                          src={item.tvShow.imageUrl}
                          alt={item.tvShow.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        {/* Exibir o título do filme/série */}
                        <span className="text-sm">{item.tvShow.title}</span>
                      </div>
                      <span className="border-b border-zinc-700 mb-2 w-full block"></span>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-2 text-white">Sua lista está vazia</p>
                )}

                <button className="block px-4 py-2 text-white hover:bg-gray-700 w-full text-left">
                  Editar Perfil
                </button>
                <button
                  className="block px-4 py-2 text-red-500 hover:bg-gray-700 w-full text-left"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUser(null);
                    router.push("/auth/login");
                  }}
                >
                  Sair
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Menu Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="md:hidden bg-zinc-900/60 backdrop-blur-sm w-full rounded-xl"
          >
            <div className="flex flex-col items-center p-4">
              {/* Logo no Menu Mobile */}
              <div className="mb-6 flex self-start">
                <Image src="/logo.png" width={150} height={150} alt="Logo" />
              </div>

              {/* Botões de Navegação */}
              <ul className="flex flex-col items-center space-y-4">
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("home");
                      setMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-white transition-all"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("about");
                      setMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-white transition-all"
                  >
                    Sobre
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("projects");
                      setMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-white transition-all"
                  >
                    Projetos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      scrollToSection("contacts");
                      setMenuOpen(false);
                    }}
                    className="text-slate-300 hover:text-white transition-all"
                  >
                    Contato
                  </button>
                </li>
              </ul>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}