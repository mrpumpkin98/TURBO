# 배포 가이드

## GitHub에 프로젝트 업로드

1. GitHub에서 새 저장소를 생성합니다 (Public으로 설정)

2. 프로젝트 디렉토리에서 다음 명령어를 실행합니다:

```bash
cd /Users/shinjaewook/Desktop/Project/Side/turborepo-project

# Git 초기화 (이미 되어있다면 생략)
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Turborepo project with web and storybook"

# GitHub 저장소 연결 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

## Vercel 배포

### 방법 1: Vercel CLI 사용

1. Vercel CLI 설치:
```bash
npm i -g vercel
```

2. 로그인:
```bash
vercel login
```

3. 프로젝트 배포:
```bash
cd /Users/shinjaewook/Desktop/Project/Side/turborepo-project
vercel
```

배포 시 다음 설정을 사용하세요:
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm build --filter web`
- **Install Command**: `pnpm install`
- **Output Directory**: (비워두기, Next.js가 자동으로 처리)

### 방법 2: Vercel 웹 대시보드 사용

1. [Vercel](https://vercel.com)에 로그인
2. "Add New Project" 클릭
3. GitHub 저장소 연결
4. 프로젝트 설정:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm build --filter web`
   - **Install Command**: `pnpm install`
   - **Output Directory**: (비워두기)

5. "Deploy" 클릭

## 환경 변수

현재 프로젝트는 환경 변수가 필요하지 않습니다.

## 배포 후 확인

배포가 완료되면 Vercel에서 제공하는 URL로 접속하여 다음을 확인하세요:

1. 메인 페이지 (`/`)에서 "사진 조회하기" 버튼이 표시되는지
2. 버튼 클릭 시 API 호출이 정상적으로 작동하는지
3. `/result` 페이지로 이동하여 사진 정보가 표시되는지

