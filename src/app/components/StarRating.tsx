import { useState, useEffect } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  showId: string;
  readOnly?: boolean;
}

export default function StarRating({ showId, readOnly = false }: StarRatingProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [average, setAverage] = useState<number>(0);
  const [totalRatings, setTotalRatings] = useState<number>(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token && !readOnly) {
          alert("Você precisa estar logado para ver as avaliações!");
          return;
        }

        if (!showId) {
          console.error("showId não está definido");
          return;
        }

        // Busca a média e o total de avaliações
        const response = await axios.get(`/api/rating?showId=${showId}`);
        console.log(response.data);
        setAverage(response.data.average);
        setTotalRatings(response.data.count);

        // Busca a avaliação do usuário atual (apenas se não for readOnly)
        if (!readOnly) {
          const userRatingResponse = await axios.get(`/api/rating/me?showId=${showId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setRating(userRatingResponse.data.rating || null);
        }
      } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
      }
    };

    if (showId) {
      fetchRatings();
    }
  }, [showId, readOnly]);

  const handleRating = async (value: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para avaliar!");
      return;
    }

    if (!showId) {
      console.error("showId não está definido");
      return;
    }

    setRating(value);

    try {
      const response = await axios.post(
        "/api/rating",
        { showId, value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response.data);
      const ratingResponse = await axios.get(`/api/rating?showId=${showId}`);
      setAverage(ratingResponse.data.average);
      setTotalRatings(ratingResponse.data.count);
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  // Função para renderizar as estrelas da média
  const renderAverageStars = () => {
    const fullStars = Math.floor(average);
    const partialStar = average - fullStars;

    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} size={25} className="text-yellow-400" />;
          } else if (index === fullStars && partialStar > 0) {
            return (
              <div key={index} style={{ position: "relative", display: "inline-block" }}>
                <FaStar size={20} className="text-gray-400" />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: `${partialStar * 100}%`,
                    overflow: "hidden",
                  }}
                >
                  <FaStar size={20} className="text-yellow-400" />
                </div>
              </div>
            );
          } else {
            return <FaStar key={index} size={20} className="text-gray-400" />;
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col mt-4 ml-3">
      {/* Exibe as estrelas da média */}
      <div className="flex items-center gap-2">
        {renderAverageStars()}
        <span className="text-white opacity-80">
          ({totalRatings} avaliações)
        </span>
      </div>

      {/* Seção de avaliação do usuário (apenas se não for readOnly) */}
      {!readOnly && (
        <div className="flex ml-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={30}
              className={`cursor-pointer transition-colors ${
                (hover || rating || 0) >= star ? "text-yellow-400" : "text-gray-400"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleRating(star)}
            />
          ))}
        </div>
      )}
    </div>
  );
}