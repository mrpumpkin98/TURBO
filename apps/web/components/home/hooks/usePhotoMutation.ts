import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { usePhotoStore, type PhotoData } from "../../../stores/photoStore";

const fetchPhotoData = async (): Promise<PhotoData> => {
   const response = await fetch("https://picsum.photos/id/0/info");
   if (!response.ok) {
      throw new Error("Failed to fetch photo data");
   }
   return response.json();
};

interface UsePhotoMutationOptions {
   applicantName: string;
   onSuccessRedirect?: string;
}

/**
 * 사진 데이터를 가져오는 mutation 훅
 * @param applicantName - 지원자 이름
 * @param onSuccessRedirect - 성공 시 리다이렉트할 경로 (기본값: "/result")
 * @returns mutation 객체와 핸들러 함수
 */
export function usePhotoMutation({
   applicantName,
   onSuccessRedirect = "/result",
}: UsePhotoMutationOptions) {
   const router = useRouter();
   const { setPhotoData, setApplicantName } = usePhotoStore();

   const mutation = useMutation({
      mutationFn: fetchPhotoData,
      onSuccess: (data) => {
         setPhotoData(data);
         setApplicantName(applicantName);
         router.push(onSuccessRedirect);
      },
      onError: (error) => {
         console.error("Error fetching photo:", error);
         alert("사진을 불러오는 중 오류가 발생했습니다.");
      },
   });

   return mutation;
}

