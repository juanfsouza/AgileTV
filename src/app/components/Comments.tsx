"use client";

import { cn } from "../lib/utils";
import { Marquee } from "./ui/marquee";
import { useEffect, useState } from "react";
import axios from "axios";

interface Comment {
  id: string;
  content: string;
  time: string;
  user: {
    name: string;
  };
}

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img
          className="rounded-full"
          width="32"
          height="32"
          alt=""
          src={`https://avatar.vercel.sh/${username}`}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get("/api/comment/me");
        setComments(response.data);
      } catch (error) {
        console.error("Erro ao buscar comentários:", error);
      }
    };

    fetchComments();
  }, []);

  if (comments.length === 0) {
    return <div className="text-center text-gray-500">Carregando comentários...</div>;
  }

  const firstRow = comments.slice(0, comments.length / 2);
  const secondRow = comments.slice(comments.length / 2);

  return (
    <div id="movies" className="relative bg-zinc-950/95 flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((comment) => (
          <ReviewCard
            key={comment.id}
            img={`https://avatar.vercel.sh/${comment.user.name}`}
            name={comment.user.name}
            username={`@${comment.user.name.toLowerCase()}`}
            body={comment.content}
          />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((comment) => (
          <ReviewCard
            key={comment.id}
            img={`https://avatar.vercel.sh/${comment.user.name}`}
            name={comment.user.name}
            username={`@${comment.user.name.toLowerCase()}`}
            body={comment.content}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}

export default Comments;