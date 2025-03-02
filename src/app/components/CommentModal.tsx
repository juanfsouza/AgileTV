import { useState } from "react";
import axios from "axios";

const CommentModal = ({ showId, onClose, onShowComments }: { showId: string; onClose: () => void; onShowComments: () => void }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para comentar!");
        return;
      }

      const response = await axios.post(
        "/api/comment",
        { showId, content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Comentário enviado:", response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-zinc-800 p-6 rounded-lg w-96">
        <h2 className="text-white text-xl mb-4">Deixe seu comentário</h2>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 bg-zinc-700 text-white rounded-lg"
          rows={4}
          placeholder="Digite seu comentário..."
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="mt-4 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Enviar
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onShowComments}
            className="text-white underline hover:text-gray-300"
          >
            Ver todos os comentários
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;