# Turborepo Project

터보레포를 사용한 모노레포 프로젝트입니다.

## 프로젝트 구조

```
turborepo-project/
├── apps/
│   ├── web/          # Next.js 웹 애플리케이션
│   └── storybook/    # Storybook
├── packages/
│   └── ui/           # 공유 UI 컴포넌트
└── package.json
```

## 기술 스택

- **Turborepo**: 모노레포 관리
- **Next.js 14**: 웹 애플리케이션 프레임워크
- **React 18**: UI 라이브러리
- **TypeScript**: 타입 안정성
- **Tailwind CSS**: 스타일링
- **TanStack Query**: 서버 상태 관리 및 데이터 페칭
- **Zustand**: 클라이언트 전역 상태 관리
- **Storybook**: 컴포넌트 문서화 및 테스트
- **pnpm**: 패키지 매니저

## 시작하기

### 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
# 모든 워크스페이스 개발 서버 실행
pnpm dev

# 특정 워크스페이스만 실행
pnpm --filter web dev
pnpm --filter storybook storybook
```

### 빌드

```bash
pnpm build
```

## 워크스페이스

### Web (`apps/web`)

Next.js 기반 웹 애플리케이션입니다.

- **라우트**: `/` (메인 페이지), `/result` (결과 페이지)
- **기능**: Picsum API를 사용한 사진 조회
- **상태 관리**:
   - TanStack Query: API 데이터 페칭 및 서버 상태 관리
   - Zustand: 클라이언트 전역 상태 관리 (사진 데이터, 지원자 이름)

#### TanStack Query 설정

API 데이터 상태 관리를 위해 TanStack Query를 사용합니다.

1. **패키지 설치**

   ```bash
   pnpm --filter web add @tanstack/react-query
   ```

2. **QueryClientProvider 설정**

   **`app/providers.tsx`** - QueryClientProvider 래퍼:

   ```typescript
   "use client";

   import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
   import { useState } from "react";

   export function Providers({ children }: { children: React.ReactNode }) {
     const [queryClient] = useState(
       () =>
         new QueryClient({
           defaultOptions: {
             queries: {
               staleTime: 60 * 1000, // 1분
               refetchOnWindowFocus: false,
             },
           },
         })
     );

     return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
   }
   ```

   **`app/layout.tsx`** - Providers로 앱 감싸기:

   ```typescript
   import { Providers } from "./providers";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="ko">
         <body>
           <Providers>{children}</Providers>
         </body>
       </html>
     );
   }
   ```

3. **사용 예시**

   **Mutation 사용 (API 호출)**:

   ```typescript
   import { useMutation } from "@tanstack/react-query";

   const mutation = useMutation({
     mutationFn: fetchPhotoData,
     onSuccess: (data) => {
       // 성공 시 처리
       sessionStorage.setItem("photoData", JSON.stringify(data));
       router.push("/result");
     },
     onError: (error) => {
       // 에러 처리
       console.error("Error:", error);
     },
   });

   // 사용
   <Button onClick={() => mutation.mutate()} isLoading={mutation.isPending}>
     다음
   </Button>
   ```

   **Query 사용 (데이터 읽기)**:

   ```typescript
   import { useQuery } from "@tanstack/react-query";

   const { data: photoData, isLoading } = useQuery({
     queryKey: ["photoData"],
     queryFn: getPhotoDataFromStorage,
     enabled: typeof window !== "undefined",
   });

   if (isLoading || !photoData) {
     return <div>로딩 중...</div>;
   }
   ```

4. **주요 포인트**
   - `useMutation`: API 호출 및 데이터 변경에 사용
   - `useQuery`: 데이터 조회 및 캐싱에 사용
   - `isPending`: Mutation의 로딩 상태
   - `isLoading`: Query의 로딩 상태
   - `enabled`: Query 실행 조건 제어 (예: 클라이언트 사이드에서만 실행)

#### Zustand 전역 상태 관리

사진 조회 데이터를 전역 상태로 관리하기 위해 Zustand를 사용합니다.

1. **패키지 설치**

   ```bash
   pnpm --filter web add zustand
   ```

2. **Store 생성 (Persist 미들웨어 포함)**

   **`stores/photoStore.ts`** - 사진 데이터 전역 상태 (localStorage 영속화):

   ```typescript
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
   ```

   **주요 설정**:
   - `persist` 미들웨어: localStorage에 자동 저장/복원
   - `_hasHydrated`: hydration 완료 상태 추적
   - `onRehydrateStorage`: localStorage에서 데이터 복원 완료 시 호출

3. **사용 예시**

   **상태 저장 (Mutation 성공 시)**:

   ```typescript
   import { usePhotoStore } from "../stores/photoStore";

   const { setPhotoData, setApplicantName } = usePhotoStore();

   const mutation = useMutation({
      mutationFn: fetchPhotoData,
      onSuccess: (data) => {
         setPhotoData(data);
         setApplicantName("신재욱");
         router.push("/result");
      },
   });
   ```

   **상태 읽기 (Hydration 처리 포함)**:

   ```typescript
   import { useEffect, useState } from "react";
   import { usePhotoStore } from "../stores/photoStore";

   const { photoData, applicantName, _hasHydrated } = usePhotoStore();
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);
   }, []);

   // Hydration 완료 전에는 로딩 표시
   if (!isClient || !_hasHydrated) {
      return <div>로딩 중...</div>;
   }

   if (!photoData) {
      return <div>데이터가 없습니다.</div>;
   }
   ```

4. **Persist 미들웨어 (데이터 영속화)**

   Zustand의 `persist` 미들웨어를 사용하여 새로고침 시에도 데이터가 유지됩니다.

   **주요 기능**:
   - `localStorage`에 자동 저장: 페이지 새로고침 후에도 데이터 유지
   - `onRehydrateStorage`: localStorage에서 데이터 복원 완료 시 콜백 실행
   - `_hasHydrated` 상태: hydration 완료 여부를 추적하여 초기 렌더링 시 데이터가 아직 로드되지 않았을 때의 문제 방지

   **Hydration 처리**:
   - `persist`는 비동기적으로 localStorage에서 데이터를 로드합니다
   - 초기 렌더링 시점에는 아직 데이터가 로드되지 않아 `photoData`가 `null`일 수 있습니다
   - `_hasHydrated` 상태를 확인하여 hydration이 완료된 후에만 데이터를 체크해야 합니다
   - 이를 통해 새로고침 시 데이터가 유지되면서도 잘못된 리다이렉트를 방지할 수 있습니다

5. **주요 포인트**
   - 간단한 API: `create` 함수로 store 생성
   - 타입 안정성: TypeScript 인터페이스로 타입 보장
   - 컴포넌트 간 상태 공유: 어디서든 `usePhotoStore` 훅으로 접근
   - 불필요한 리렌더링 방지: 필요한 상태만 선택적으로 구독 가능
   - 데이터 영속화: `persist` 미들웨어로 새로고침 후에도 데이터 유지
   - Hydration 처리: `_hasHydrated` 상태로 초기 로딩 시점의 문제 방지

#### 버튼 클릭 스로틀링

사진 조회 버튼 클릭 시 중복 클릭을 방지하기 위해 스로틀링을 적용했습니다.

1. **구현 방법**

   **`app/page.tsx`** - 스로틀링 적용:

   ```typescript
   import { useRef } from "react";

   const throttleRef = useRef<boolean>(false);
   const THROTTLE_DELAY = 1000; // 1초

   const handleNext = () => {
      // 로딩 중이거나 스로틀링 중이면 클릭 무시
      if (mutation.isPending || throttleRef.current) {
         return;
      }

      throttleRef.current = true;
      mutation.mutate();

      setTimeout(() => {
         throttleRef.current = false;
      }, THROTTLE_DELAY);
   };
   ```

2. **동작 방식**
   - 버튼 클릭 시 `mutation.isPending` 또는 `throttleRef.current`가 `true`이면 클릭 무시
   - 클릭 가능한 경우 mutation 실행 후 1초 동안 스로틀링 상태 유지
   - 1초 후 다시 클릭 가능

3. **주요 포인트**
   - `useRef`를 사용하여 컴포넌트 리렌더링 없이 스로틀링 상태 관리
   - `mutation.isPending`과 함께 체크하여 로딩 중 중복 클릭 방지
   - 사용자가 실수로 여러 번 클릭해도 1초에 한 번만 실행
   - API 호출 횟수 감소로 서버 부하 감소

#### 자동 리다이렉트

사진을 한 번이라도 조회한 이력이 있을 경우, 홈 페이지(`/`) 접속 시 자동으로 결과 페이지(`/result`)로 이동합니다.

1. **구현 방법**

   **`app/page.tsx`** - 자동 리다이렉트 로직:

   ```typescript
   import { useEffect, useState } from "react";
   import { useRouter } from "next/navigation";
   import { usePhotoStore } from "../stores/photoStore";

   const { photoData, _hasHydrated } = usePhotoStore();
   const [isClient, setIsClient] = useState(false);
   const router = useRouter();

   useEffect(() => {
      setIsClient(true);
   }, []);

   // 사진 조회 이력이 있으면 자동으로 /result 페이지로 이동
   useEffect(() => {
      if (isClient && _hasHydrated && photoData) {
         router.push("/result");
      }
   }, [isClient, _hasHydrated, photoData, router]);
   ```

2. **동작 방식**
   - 페이지 로드 시 `isClient` 상태를 `true`로 설정 (클라이언트 사이드 체크)
   - Zustand의 `_hasHydrated`가 `true`가 될 때까지 대기 (localStorage 복원 완료)
   - `photoData`가 존재하면 자동으로 `/result` 페이지로 리다이렉트
   - `photoData`가 없으면 기존처럼 홈 화면 표시

3. **주요 포인트**
   - `isClient` 체크: 서버 사이드 렌더링 시 리다이렉트 방지
   - `_hasHydrated` 체크: localStorage 복원 완료 후에만 리다이렉트 실행
   - 사용자 경험 개선: 이미 조회한 사진이 있으면 바로 결과 페이지로 이동
   - Zustand persist와 연동: localStorage에 저장된 데이터를 기반으로 동작

#### 결과 페이지 리다이렉트

사진 조회 이력 없이 `/result` 페이지로 직접 이동하는 경우, 1초 후 자동으로 메인 페이지(`/`)로 리다이렉트됩니다.

1. **구현 방법**

   **`app/result/page.tsx`** - 1초 지연 리다이렉트:

   ```typescript
   useEffect(() => {
      // Wait for hydration to complete before checking data
      if (isClient && _hasHydrated && !photoData) {
         // 1초 후 메인 페이지로 리다이렉트
         const timer = setTimeout(() => {
            router.push("/");
         }, 1000);

         return () => clearTimeout(timer);
      }
   }, [isClient, _hasHydrated, photoData, router]);
   ```

2. **동작 방식**
   - hydration 완료 후 `photoData`가 없으면 즉시 리다이렉트하지 않음
   - `setTimeout`을 사용하여 1초(1000ms) 지연 후 메인 페이지로 리다이렉트
   - cleanup 함수로 컴포넌트 unmount 시 타이머 정리

3. **주요 포인트**
   - 지연 리다이렉트: 사용자가 잘못된 경로에 접근했을 때 즉시 리다이렉트하지 않고 1초 대기
   - 타이머 정리: cleanup 함수로 메모리 누수 방지
   - hydration 완료 후 체크: localStorage 복원 완료 후에만 리다이렉트 실행
   - 사용자 경험: 스켈레톤 UI를 잠깐 보여준 후 리다이렉트하여 자연스러운 전환

#### 스켈레톤 UI

사진 조회 페이지의 정보 영역에 로딩 상태를 표시하기 위해 스켈레톤 UI를 구현했습니다.

1. **스켈레톤 컴포넌트 생성**

   **`components/ResultSkeleton.tsx`** - 결과 페이지 스켈레톤:

   ```typescript
   export function ResultSkeleton() {
      return (
         <>
            {/* Left Panel - Image Skeleton */}
            <div className="">
               <div className="w-full h-[400px] bg-gray-200 rounded-3xl animate-pulse" />
            </div>

            {/* Right Panel - Metadata Skeleton */}
            <div className="space-y-4 flex flex-col justify-center">
               {/* Metadata Container 1 Skeleton: id, author */}
               <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex flex-col">
                        <div className="h-4 w-8 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                     </div>
                     <div className="flex flex-col">
                        <div className="h-4 w-12 bg-gray-200 rounded mb-2 animate-pulse" />
                        <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                     </div>
                  </div>
               </div>
               {/* ... 더 많은 스켈레톤 요소들 ... */}
            </div>
         </>
      );
   }
   ```

2. **사용 방법**

   **`app/result/page.tsx`** - 스켈레톤 컴포넌트 사용:

   ```typescript
   import { ResultSkeleton } from "../../components/ResultSkeleton";

   const isLoading = !isClient || !_hasHydrated || !photoData;

   return (
      <main>
         {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[50px] lg:gap-[70px]">
               <ResultSkeleton />
            </div>
         ) : (
            // 실제 콘텐츠
         )}
      </main>
   );
   ```

3. **주요 포인트**
   - 별도 컴포넌트로 분리: 재사용성 및 유지보수성 향상
   - 실제 콘텐츠와 동일한 레이아웃: 자연스러운 전환 효과
   - Tailwind의 `animate-pulse`: 펄스 애니메이션으로 로딩 상태 표시
   - 이미지 및 메타데이터 영역 모두 스켈레톤 처리: 일관된 로딩 경험
   - hydration 완료 전까지 스켈레톤 표시: 사용자에게 로딩 상태 명확히 전달

#### 배경 이미지

사진 조회 페이지의 배경은 조회한 사진을 사용하여 동적으로 생성됩니다.

1. **구현 방법**

   **`app/result/page.tsx`** - 조회한 사진을 배경으로 사용:

   ```typescript
   {!isLoading && photoData && (
      <div
         className="absolute inset-0 z-0"
         style={{
            backgroundImage: `url(${photoData.download_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px)",
         }}
      >
         {/* Overlay for better readability */}
         <div className="absolute inset-0 bg-white/60" />
      </div>
   )}
   ```

2. **동작 방식**
   - 로딩이 완료되고 `photoData`가 있을 때만 배경 이미지 표시
   - 조회한 사진(`photoData.download_url`)을 배경으로 사용
   - `filter: blur(8px)`로 배경 이미지를 뿌옇게 처리
   - 흰색 오버레이(`bg-white/60`)로 콘텐츠 가독성 향상
   - `overflow-hidden`으로 불필요한 스크롤 방지

3. **주요 포인트**
   - 동적 배경: 조회한 사진에 따라 배경이 자동으로 변경
   - Blur 효과: 배경을 뿌옇게 처리하여 콘텐츠에 집중
   - 흰색 오버레이: 텍스트와 콘텐츠의 가독성 보장
   - 성능 최적화: 로딩 중에는 배경을 표시하지 않아 불필요한 렌더링 방지
   - 반응형 디자인: `backgroundSize: cover`로 다양한 화면 크기에 대응

#### 404 페이지

존재하지 않는 route에 접근할 때 표시되는 404 페이지를 구현했습니다.

1. **구현 방법**

   **`app/not-found.tsx`** - 404 페이지:

   ```typescript
   export default function NotFound() {
      return (
         <main className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="text-center">
               <h1 className="text-6xl font-bold text-black mb-4">404</h1>
               <h2 className="text-2xl font-semibold text-black mb-2">페이지를 찾을 수 없습니다</h2>
               <p className="text-gray-600 mb-8">요청하신 페이지가 존재하지 않습니다.</p>
            </div>
         </main>
      );
   }
   ```

2. **동작 방식**
   - Next.js App Router에서 `not-found.tsx` 파일은 특별한 파일로 인식됩니다
   - 존재하지 않는 route에 접근하면 자동으로 이 페이지가 표시됩니다
   - 서버 컴포넌트로 구현되어 성능 최적화

3. **주요 포인트**
   - 자동 인식: Next.js가 `not-found.tsx` 파일을 자동으로 404 페이지로 인식
   - 서버 컴포넌트: 클라이언트 컴포넌트가 아닌 서버 컴포넌트로 구현
   - 사용자 친화적: 명확한 에러 메시지로 사용자에게 상황을 알림
   - 간단한 디자인: 깔끔한 레이아웃으로 사용자 경험 향상

### Storybook (`apps/storybook`)

UI 컴포넌트의 스토리북입니다.

- **포트**: 6006
- **기능**: Button 컴포넌트의 다양한 상태별 스토리

#### Tailwind CSS 설정

Storybook에서 Tailwind CSS를 사용하기 위한 설정:

1. **필요한 패키지 설치**

   ```bash
   pnpm --filter storybook add -D @storybook/addon-postcss postcss tailwindcss autoprefixer
   ```

2. **주요 설정 파일**

   **`apps/storybook/postcss.config.js`** - PostCSS 설정:

   ```javascript
   const path = require("path");

   module.exports = {
      plugins: {
         tailwindcss: {
            config: path.join(__dirname, "./tailwind.config.js"),
         },
         autoprefixer: {},
      },
   };
   ```

   **`apps/storybook/tailwind.config.js`** - Tailwind 설정:

   ```javascript
   const path = require("path");

   module.exports = {
      content: [
         path.join(__dirname, "./stories/**/*.{js,ts,jsx,tsx}"),
         path.join(__dirname, "./.storybook/**/*.{js,ts,jsx,tsx}"),
         path.join(__dirname, "../../packages/ui/**/*.{js,ts,jsx,tsx}"),
      ],
      theme: {
         extend: {},
      },
      plugins: [],
   };
   ```

   **`.storybook/preview.js`** - Tailwind CSS import:

   ```javascript
   import "./styles.css";

   export const parameters = {
      // ...
   };
   ```

   **`.storybook/styles.css`** - Tailwind directives:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. **중요 포인트**
   - `path.join(__dirname, ...)`을 사용하여 절대 경로로 변환해야 Tailwind가 파일을 정확히 스캔합니다
   - PostCSS 설정에서 `tailwindcss` 플러그인에 명시적으로 config 경로를 지정해야 합니다
   - `packages/ui` 컴포넌트의 Tailwind 클래스도 스캔 대상에 포함해야 합니다

### UI Package (`packages/ui`)

공유 UI 컴포넌트 패키지입니다.

- **Button**: 다양한 variant와 size를 지원하는 버튼 컴포넌트

## Git 브랜치 전략

프로젝트는 기능별 브랜치를 생성하여 작업하고 main 브랜치에 병합하는 방식을 사용합니다.

### 브랜치 생성 및 작업

```bash
# 새 기능 브랜치 생성
git checkout -b feature/기능명

# 예시
git checkout -b feature/tanstack-query-integration
```

### 작업 완료 후 병합

```bash
# 변경사항 커밋
git add .
git commit -m "feat: 기능 설명"

# main 브랜치로 전환
git checkout main

# 브랜치 병합
git merge feature/기능명

# 원격 저장소에 푸시
git push origin main
```

## 배포

### Vercel

웹 애플리케이션은 Vercel을 통해 배포됩니다.

1. Vercel에 프로젝트 연결
2. Root Directory: `apps/web` 설정
3. Build Command: `cd ../.. && pnpm build --filter web`
4. Output Directory: `.next`
