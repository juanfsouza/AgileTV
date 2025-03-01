"use client";

import Modal from "./Modal"
import axios from "axios";
import Navbar from "@/src/app/components/Navbar";
import StarRating from "@/src/app/components/StarRating";
import 'swiper/css';
import 'swiper/css/autoplay';
import { useQuery } from "@tanstack/react-query";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { IoIosArrowDropright, IoIosPlayCircle } from "react-icons/io";
import { ShinyButton } from "./ui/shiny-button";
import { ShineBorder } from "./ui/shine-border";;
import { TextAnimate } from "./ui/text-animate";
import { FaList, FaStar, FaMicrophone, FaShareAlt } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { useMyListStore } from "../store/useMylistStore";
import StarRatingModal from "./StarRatingModal";
import { motion } from "motion/react";

const fetchTVShowData = async () => {
  const response = await axios.get("https://agile-releases.s3.us-east-1.amazonaws.com/tests/tv-shows/SHOW123.json");
  return response.data;
};

const fetchEpisodesData = async () => {
  const response = await axios.get("https://agile-releases.s3.us-east-1.amazonaws.com/tests/episodes/SHOW123.json");
  return response.data;
};

export default function Dashboard() {
  const { data: tvShowData, error: tvShowError } = useQuery({
    queryKey: ["tv-show"],
    queryFn: fetchTVShowData,
  });

  const { data: episodesData, error: episodesError } = useQuery({
    queryKey: ["episodes"],
    queryFn: fetchEpisodesData,
  });

  const [showEpisodes, setShowEpisodes] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalEpisode, setModalEpisode] = useState<any>(null);
  const [selectedTab, setSelectedTab] = useState("Geral");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { myList, setMyList } = useMyListStore();
  const [showRatingPage, setShowRatingPage] = useState(false);

  if (tvShowError || episodesError) return <div>Error: {tvShowError?.message || episodesError?.message}</div>;

  const handleImageClick = (episode: any) => {
    setModalEpisode(episode);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalEpisode(null);
  };

  const filteredEpisodes = episodesData
    ?.filter((episode: any) => episode !== null)
    .filter((episode: any) =>
      selectedSeason ? episode.SeasonNumber === selectedSeason : false
    );
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (tvShowData?.ID) {
      setIsLoading(false);
    }
  }, [tvShowData]);
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  const handleAddToList = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Você precisa estar logado para adicionar à lista");
        return;
      }
  
      const response = await fetch("/api/mylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showId: String(tvShowData?.ID),
          title: tvShowData?.Title,
          imageUrl: tvShowData?.Images?.Background,
        }),
      });
  
      if (response.ok) {
        const newItem = await response.json();
  
        setMyList([...myList, newItem]);
  
        alert("Filme adicionado à sua lista!");
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao adicionar à lista");
      }
    } catch (error) {
      setError("Erro ao adicionar à lista");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-nunito">
      <Navbar />
  
      <main
        style={{
          backgroundImage: tvShowData?.Images?.Background 
            ? `url(${tvShowData.Images.Background})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-screen bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-radial from-[#0F0F12] via-[#16161B] to-[#1A1A20]"></div>
        <div className="relative z-10 p-4 md:p-6 text-white flex flex-col md:flex-row justify-between items-start">
          {/* Esquerda: Título, Infos, Gêneros e Botão de Play */}
          <div className="w-full md:w-auto">
            <div className="mt-16 md:mt-32 text-4xl md:text-7xl font-bold leading-tight uppercase">
              {isVisible && (
                <TextAnimate animation="slideLeft" by="character">
                  {tvShowData?.Title || "Carregando..."}
                </TextAnimate>
              )}
            </div>

            <div className="text-sm md:text-lg whitespace-pre-line opacity-80 max-w-3xl ml-2 md:ml-5">
              {isVisible && (
                <TextAnimate animation="slideLeft" by="character">
                  {tvShowData
                    ? `Indicado 80% / ${tvShowData.Year} / EUA / 2h : 6mins`
                    : "Carregando..."}
                </TextAnimate>
              )}

              {tvShowData?.ID && <StarRating showId={tvShowData.ID} readOnly={true} />}

              {/* Gêneros e Tags */}
              <div className="mt-2 md:mt-4 text-red-600 font-bold text-sm md:text-lg">
                Gênero: <span className="text-white">{tvShowData?.Genres[0]?.Title || "N/A"}</span>
              </div>
              <div className="mt-1 text-red-600 font-bold text-sm md:text-lg">
                Tag: <span className="text-white">{tvShowData?.Genres.map((genre: { Title: any }) => genre.Title).join(", ")}</span>
              </div>

              {/* Botão de Play */}
              <button className="mt-4 md:mt-6 px-4 md:px-6 py-2 md:py-3 text-sm md:text-lg font-bold text-white bg-red-600 rounded-lg shadow-lg 
                flex items-center gap-2 transition duration-300 hover:brightness-110 hover:scale-105">
                ASSISTIR AGORA <IoIosPlayCircle size={18} />
              </button>
            </div>
          </div>

  
          {/* Direita: Botão para alternar visibilidade dos episódios */}
          <div className="flex flex-col items-end md:mt-60 w-full md:w-auto">
            <div className="flex justify-center mb-2">
              {showEpisodes && (
                  <div className="flex gap-4 mr-32 md:mr-20">
                    {[1, 2, 3].map((season) => (
                      <ShinyButton
                        key={season}
                        onClick={() => setSelectedSeason(season)}
                        className={`px-2 md:px-4 py-1 md:py-2 text-white font-bold transition-all duration-300 rounded-lg ${
                          selectedSeason === season ? "bg-red-600/80" : "bg-zinc-800 hover:bg-zinc-700"
                        }`}
                      >
                        T{season}
                      </ShinyButton>
                    ))}
                </div>
              )}
  
            {/* Botão para alternar visibilidade dos episódios */}
            <ShinyButton
              onClick={() => setShowEpisodes(!showEpisodes)}
              className="bg-red-600/50 transition-all duration-500 transform font-bold flex items-center"
              style={{
                width: showEpisodes ? "auto" : "50px",
                height: showEpisodes ? "auto" : "45px",
                padding: showEpisodes ? "12px 15px" : "12px",
              }}
            >
              {showEpisodes ? (
                <FaTimes className="text-white" size={20} />
              ) : (
                <FaArrowLeft className="text-white" size={20} />
              )}
            </ShinyButton>
          </div>
  
          {/* Exibindo os episódios com animação de dropdown */}

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`overflow-hidden mt-2 transition-all duration-500 ease-in-out ${
              showEpisodes ? "max-h-[500px]" : "max-h-0"
            }`}
          >
            <div className="relative z-10 flex flex-col items-end overflow-y-auto max-h-[500px] min-w-[500px] scroll-smooth pr-2 pl-2 custom-scrollbar">
              {filteredEpisodes?.map((episode: any) =>
                episode ? (
                  <div
                    key={episode.ID}
                    className="flex justify-between items-center backdrop-blur-sm text-white m-1 rounded-lg hover:shadow-xl transition-all w-full max-w-md"
                  >
                    <ShineBorder className="w-full max-w-md relative rounded-lg" color={["#dbdbdba1", "#000", "#f5f3f35f"]}>
                      <div
                        className="flex justify-between items-center w-full cursor-pointer"
                        onClick={() => setSelectedEpisode(episode.ID === selectedEpisode ? null : episode.ID)}
                      >
                        <h4 className="flex-grow text-sm md:text-lg font-semibold text-center ml-2 md:ml-5 text-gray-300 hover:text-gray-100">{episode.Title}</h4>
                        <div className="ml-auto">
                          <IoIosArrowDropright 
                            className={`text-gray-300 hover:text-gray-100 transition-transform duration-300 ${
                              selectedEpisode === episode.ID ? "rotate-90" : "rotate-0"
                            }`}
                            size={20}
                          />
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500">Duração: {episode.Duration} min</p>
  
                      {/* Dropdown com detalhes do episódio */}
                      {selectedEpisode === episode.ID && (
                        <div className="backdrop-blur-sm bg-opacity-75 text-white p-4 md:p-6 rounded-lg shadow-lg mt-2 md:mt-4">
                          <div className="flex-1 flex-col md:flex-row space-x-1">
                            {/* Container da Imagem */}
                            <div className="relative group w-56 md:w-72 h-32 md:h-40 cursor-pointer" onClick={() => handleImageClick(episode)}>
                              <img
                                src={episode.Image}
                                alt={episode.Title}
                                className="w-full h-full object-cover rounded-lg shadow-xl shadow-red-900/20 transition-opacity duration-300 group-hover:opacity-70"
                              />
                              {/* Ícone de Play */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <IoIosPlayCircle size={30} className="text-white drop-shadow-lg" />
                              </div>
                            </div>

                            {/* Detalhes do Episódio */}
                            <div className="space-y-2 mt-2">
                              <h4 className="text-lg md:text-xl font-semibold">{episode.Title}</h4>
                              <p className="text-xs md:text-sm text-gray-400">{episode.Synopsis}</p>
                              <p className="text-xs md:text-sm text-gray-500">Duração: {episode.Duration} min</p>
                            </div>
                          </div>
                        </div>
                      )}
                      </ShineBorder>
                    </div>
                  ) : null
                )}
              </div>
            </motion.div>
          </div>
        </div>
        
          {/* Detalhes do Show */}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-linear rounded-lg p-2 md:p-4 mt-8 md:mt-0">
            {/* Botões de Navegação */}
            <div className="flex gap-4 mb-5 md:gap-20 ml-4 md:ml-40 justify-center md:justify-start">
              <ShinyButton onClick={() => setSelectedTab("Geral")} className={`px-2 md:px-4 py-1 md:py-2 ${selectedTab === "Geral" ? "bg-red-600/80" : "bg-zinc-800"}`}>
                Geral
              </ShinyButton>
              <ShinyButton onClick={() => setSelectedTab("Elenco")} className={`px-2 md:px-4 py-1 md:py-2 ${selectedTab === "Elenco" ? "bg-red-600/80" : "bg-zinc-800"}`}>
                Elenco
              </ShinyButton>
              <ShinyButton onClick={() => setSelectedTab("Premios")} className={`px-2 md:px-4 py-1 md:py-2 ${selectedTab === "Premios" ? "bg-red-600/80" : "bg-zinc-800"}`}>
                Prêmios
              </ShinyButton>
            </div>

            <div className="mt-2 md:mt-4">
              {selectedTab === "Geral" && (
                <div className="flex flex-col md:flex-row items-center ml-4 md:ml-20 gap-4 md:gap-10">
                  {/* Botões de ação com Ícones + Texto */}
                  <div className="flex items-center gap-0 md:gap-0">
                    <div className="flex flex-col items-center">
                      <FaList className="text-white" size={20} />
                      <ShinyButton onClick={handleAddToList}>
                        Minha Lista
                      </ShinyButton>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaStar className="text-white" size={20} />
                      <ShinyButton onClick={() => setShowRatingPage(true)}>
                        Avaliar
                      </ShinyButton>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaMicrophone className="text-white" size={20} />
                      <ShinyButton>Comentar</ShinyButton>
                    </div>
                    <div className="flex flex-col items-center">
                      <FaShareAlt className="text-white" size={20} />
                      <ShinyButton>Compartilhar</ShinyButton>
                    </div>
                  </div>

                  <div className="hidden md:block h-16 md:h-24 w-[2px] bg-zinc-700"></div>

                  <div className="text-gray-400 w-full max-w-xl">
                    <p className="text-white font-semibold mb-2">Sinopse</p>
                    {tvShowData?.Synopsis}
                  </div>
                </div>
              )}
              {/* Modal de Avaliação */}
              {showRatingPage && tvShowData?.ID && (
                <StarRatingModal
                  showId={tvShowData.ID}
                  onClose={() => setShowRatingPage(false)}
                />
              )}
              {/* Aba Elenco */}
              {selectedTab === "Elenco" && (
                <div className="mt-4 md:mt-6 relative">
                  <Swiper
                    modules={[Autoplay, Navigation]}
                    spaceBetween={10}
                    slidesPerView={4}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                    loop={true}
                    navigation={{
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }}
                    speed={500}
                    className="text-white"
                  >
                    {Array.from({ length: 5 }).map((_, index) => {
                      const actor = tvShowData?.Cast[index] || { ID: `fake-${index}`, Name: "" };
                      return (
                        <SwiperSlide key={actor.ID}>
                          <div className="bg-zinc-800 p-2 md:p-4 rounded-lg flex flex-col items-center">
                            <div className="w-5 h-5 md:w-7 md:h-7 bg-gray-600 rounded-full mb-1 md:mb-2" />
                            <p className="text-xs md:text-sm">{actor.Name || "Sem nome"}</p>
                          </div>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>

                  {/* Botões de navegação personalizados */}
                  <div className="swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-white cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 bg-zinc-900 rounded-full p-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </div>
                  <div className="swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-white cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 bg-zinc-900 rounded-full p-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Aba Prêmios */}
              {selectedTab === "Premios" && (
                <div className="mt-4 md:mt-6">
                  {tvShowData?.Awards && tvShowData.Awards.length > 0 ? (
                    <Swiper spaceBetween={10} slidesPerView={2} className="text-white">
                      {tvShowData.Awards.map((award: { ID: Key | null | undefined; Title: string | number | bigint | boolean | ReactElement<unknown, string 
                        | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal 
                        | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                        <SwiperSlide key={award.ID}>
                          <div className="bg-zinc-800 p-2 md:p-4 rounded-lg flex flex-col items-center">
                            <p className="text-xs md:text-sm text-center">{award.Title}</p>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  ) : (
                    <div className="bg-zinc-800 p-2 md:p-4 rounded-lg text-center text-gray-400">Nenhum prêmio disponível</div>
                  )}
                </div>
              )}
            </div>
          </div>
  
        </main>
        {/* Exibindo o Modal se o estado showModal for verdadeiro */}
        {showModal && modalEpisode && (
          <Modal
            imageUrl={modalEpisode.Image}
            onClose={closeModal}
          />
        )}
      </div>
    );
  }