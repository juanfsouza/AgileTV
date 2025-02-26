"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "@/src/app/components/Navbar";
import { useState } from "react";
import { FaArrowLeft, FaTimes } from "react-icons/fa";
import { IoIosArrowDropright, IoIosPlayCircle } from "react-icons/io";
import { ShinyButton } from "./ui/shiny-button";
import { ShineBorder } from "./ui/shine-border";
import Modal from "./Modal"; // Importando o Modal

// Função para buscar os dados do TV Show
const fetchTVShowData = async () => {
  const response = await axios.get("https://agile-releases.s3.us-east-1.amazonaws.com/tests/tv-shows/SHOW123.json");
  return response.data;
};

// Função para buscar os dados dos Episódios
const fetchEpisodesData = async () => {
  const response = await axios.get("https://agile-releases.s3.us-east-1.amazonaws.com/tests/episodes/SHOW123.json");
  return response.data;
};

export default function Dashboard() {
  const { data: tvShowData, error: tvShowError, isLoading: tvShowLoading } = useQuery({
    queryKey: ["tv-show"],
    queryFn: fetchTVShowData,
  });

  const { data: episodesData, error: episodesError, isLoading: episodesLoading } = useQuery({
    queryKey: ["episodes"],
    queryFn: fetchEpisodesData,
  });

  const [showEpisodes, setShowEpisodes] = useState(false); // Estado para mostrar/ocultar episódios
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null); // Temporada selecionada
  const [selectedEpisode, setSelectedEpisode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalEpisode, setModalEpisode] = useState<any>(null);

  if (tvShowLoading || episodesLoading) return <div>Loading...</div>;
  if (tvShowError || episodesError) return <div>Error: {tvShowError?.message || episodesError?.message}</div>;

  // Função para abrir o modal com o episódio selecionado
  const handleImageClick = (episode: any) => {
    setModalEpisode(episode);
    setShowModal(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setShowModal(false);
    setModalEpisode(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-nunito">
      <Navbar />

      <main
        style={{
          backgroundImage: `url(${tvShowData.Images?.Background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="relative h-screen bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 p-6 text-white max-w-3xl">
          <h3 className="mt-32 text-8xl font-bold leading-tight">{tvShowData?.Title}</h3>
          <p className="text-lg mt-2 whitespace-pre-line opacity-80">{tvShowData?.Synopsis}</p>
        </div>

        {/* Botão para alternar a visibilidade dos episódios, posicionado à direita */}
        <div className="flex justify-end mb-2">
          {showEpisodes && (
              <div className="flex gap-2 mr-24">
                {[1, 2, 3].map((season) => (
                  <ShinyButton
                    key={season}
                    onClick={() => setSelectedSeason(season)}
                    className={`px-4 py-2 text-white font-bold transition-all duration-300 rounded-lg ${
                      selectedSeason === season ? "bg-red-600/80" : "bg-gray-700 hover:bg-gray-600"
                    }`}
                  >
                    T{season}
                  </ShinyButton>
                ))}
              </div>
            )}
          <ShinyButton
            onClick={() => setShowEpisodes(!showEpisodes)}
            className="bg-red-600/50 transition-all duration-500 transform font-bold flex items-center"
            style={{
              width: showEpisodes ? "auto" : "48px",
              height: showEpisodes ? "auto" : "48px",
              padding: showEpisodes ? "12px 15px" : "12px",
            }}
          >
            {showEpisodes ? (
              <FaTimes className="text-white" size={24} />
            ) : (
              <FaArrowLeft className="text-white" size={24} />
            )}
          </ShinyButton>
        </div>
        

        {/* Exibindo os episódios com animação de dropdown */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showEpisodes ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="flex flex-col items-end overflow-y-auto max-h-[500px] scroll-smooth pr-2 custom-scrollbar">
            {episodesData?.map((episode: any) =>
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
                      <h4 className="flex-grow text-lg font-semibold text-center ml-5 text-gray-300 hover:text-gray-100">{episode.Title}</h4>
                      <div className="ml-auto">
                        <IoIosArrowDropright 
                          className={`text-gray-300 hover:text-gray-100 transition-transform duration-300 ${
                            selectedEpisode === episode.ID ? "rotate-90" : "rotate-0"
                          }`}
                          size={24}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">Duração: {episode.Duration} min</p>

                    {/* Dropdown com detalhes do episódio */}
                    {selectedEpisode === episode.ID && (
                      <div className="backdrop-blur-sm bg-opacity-75 text-white p-6 rounded-lg shadow-lg mt-4">
                        <div className="flex-1 flex-col md:flex-row space-x-1">
                          <div className="relative group w-62 h-62 cursor-pointer" onClick={() => handleImageClick(episode)}>
                            <img
                              src={episode.Image}
                              alt={episode.Title}
                              className="w-62 h-62 object-cover rounded-lg shadow-xl shadow-red-900/20 transition-opacity duration-300 group-hover:opacity-70"
                            />
                            <div className="absolute mr-16 inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <IoIosPlayCircle size={50} className="text-white drop-shadow-lg" />
                            </div>
                          </div>
                            <div className="space-y-2 mt-2">
                              <h4 className="text-xl font-semibold">{episode.Title}</h4>
                              <p className="text-sm text-gray-400">{episode.Synopsis}</p>
                              <p className="text-sm text-gray-500">Duração: {episode.Duration} min</p>
                            </div>
                          </div>
                        </div>
                    )}
                  </ShineBorder>
                </div>
              ) : null
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
