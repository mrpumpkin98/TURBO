import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
   _hasHydrated: boolean;
   setPhotoData: (data: PhotoData) => void;
   setApplicantName: (name: string) => void;
   clearData: () => void;
   setHasHydrated: (state: boolean) => void;
}

export const usePhotoStore = create<PhotoStore>()(
   persist(
      (set) => ({
         photoData: null,
         applicantName: "",
         _hasHydrated: false,
         setPhotoData: (data) => set({ photoData: data }),
         setApplicantName: (name) => set({ applicantName: name }),
         clearData: () => set({ photoData: null, applicantName: "" }),
         setHasHydrated: (state) => {
            set({
               _hasHydrated: state,
            });
         },
      }),
      {
         name: "photo-storage", // localStorage key
         storage: createJSONStorage(() => localStorage),
         onRehydrateStorage: () => (state) => {
            state?.setHasHydrated(true);
         },
      }
   )
);
