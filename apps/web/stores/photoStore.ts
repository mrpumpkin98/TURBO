import { create } from "zustand";

export interface PhotoData {
   id: string;
   author: string;
   width: number;
   height: number;
   url: string;
   download_url: string;
}

interface PhotoStore {
   photoData: PhotoData | null;
   applicantName: string;
   setPhotoData: (data: PhotoData) => void;
   setApplicantName: (name: string) => void;
   clearData: () => void;
}

export const usePhotoStore = create<PhotoStore>((set) => ({
   photoData: null,
   applicantName: "",
   setPhotoData: (data) => set({ photoData: data }),
   setApplicantName: (name) => set({ applicantName: name }),
   clearData: () => set({ photoData: null, applicantName: "" }),
}));
