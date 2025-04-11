import { create } from "zustand";

export type ImgState = {
  img: HTMLImageElement | null;
  setImg: (img: HTMLImageElement) => void;
};

export const useImgUpload = create<ImgState>()((set) => ({
  img: null,
  setImg: (img) => set({ img }),
}));
