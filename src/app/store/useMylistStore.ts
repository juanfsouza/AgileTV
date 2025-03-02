import { create } from "zustand";

interface UserState {
  user: { name: string } | null;
  setUser: (user: { name: string } | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

interface MyListItem {
  id: string;
  userId: string;
  showId: string;
  createdAt: Date;
  tvShow: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
  };
}

interface MyListState {
  myList: MyListItem[];
  setMyList: (list: MyListItem[]) => void;
}

export const useMyListStore = create<MyListState>((set) => ({
  myList: [],
  setMyList: (list) => set({ myList: list }),
}));