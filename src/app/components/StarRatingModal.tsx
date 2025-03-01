import { useState } from "react";
import { FaStar } from "react-icons/fa";
import axios from "axios";

interface StarRatingModalProps {
  showId: string;
  onClose: () => void;
}

export default function StarRatingModal({ showId, onClose }: StarRatingModalProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);

  const handleRating = async (value: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para avaliar!");
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
      onClose(); // Fecha o modal após a avaliação
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-white text-lg font-semibold mb-4">Avalie a série ou filme:</h3>
        <div className="flex justify-center">
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
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}