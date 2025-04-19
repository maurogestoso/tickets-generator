import { create } from "zustand";

export type ImgState = {
  img: HTMLImageElement | null;
  setImg: (img: HTMLImageElement) => void;
  readImg: (file: File) => void;
};

export const useImgUpload = create<ImgState>()((set) => ({
  img: null,
  setImg: (img) => set({ img }),
  readImg(file) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      if (!e.target || !e.target.result) return;

      const newImg = new Image();
      newImg.src = e.target?.result?.toString();
      set({ img: newImg });
    };
  },
}));
