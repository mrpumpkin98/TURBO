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
- **상태 관리**: TanStack Query를 사용한 API 데이터 상태 관리

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
