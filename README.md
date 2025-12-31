# 아기 이유식 레시피 앱

우리 아이를 위한 건강한 이유식 레시피 검색 앱입니다.

## 주요 기능

- **레시피 검색**: 재료명 또는 레시피 이름으로 실시간 검색
- **월령별 필터**: 6개월, 7개월, 9개월, 10개월, 12개월, 1세이상
- **단계별 필터**: 초기, 중기, 후기, 완료기
- **즐겨찾기**: 자주 사용하는 레시피 저장 (로컬 스토리지)
- **재료 체크리스트**: 준비한 재료 체크 기능
- **조리 단계 체크**: 완료한 단계 표시
- **오프라인 지원**: PWA로 오프라인에서도 사용 가능
- **모바일 최적화**: 반응형 디자인, 터치 친화적 UI

## 기술 스택

- **React 18** (CDN)
- **Tailwind CSS** (CDN)
- **PWA** (Service Worker, Web App Manifest)
- **LocalStorage** (즐겨찾기, 필터 설정 저장)

## 실행 방법

### 로컬 서버로 실행

```bash
cd baby-recipe-app
python -m http.server 3000
```

브라우저에서 http://localhost:3000 접속

### 또는 VS Code Live Server

1. VS Code에서 `baby-recipe-app` 폴더 열기
2. Live Server 확장 설치
3. `index.html` 우클릭 → "Open with Live Server"

## 배포 방법

### GitHub Pages

1. GitHub 저장소 생성
2. 파일 업로드:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/username/baby-recipe-app.git
   git push -u origin main
   ```
3. Settings → Pages → Source: main branch → Save

### Netlify

1. [Netlify](https://netlify.com) 접속
2. "Add new site" → "Deploy manually"
3. `baby-recipe-app` 폴더를 드래그 앤 드롭

### Vercel

1. [Vercel](https://vercel.com) 접속
2. GitHub 저장소 연결
3. 자동 배포

## 프로젝트 구조

```
baby-recipe-app/
├── index.html          # 메인 앱 (React + Tailwind)
├── manifest.json       # PWA 매니페스트
├── sw.js              # Service Worker (오프라인 지원)
├── README.md          # 문서
└── src/
    └── data/
        └── recipes.json  # 레시피 데이터 (76개)
```

## 레시피 데이터 형식

```json
{
  "id": 1,
  "title": "당근 케일 감자 매시스틱",
  "age": "6개월부터",
  "category": "초기",
  "ingredients": ["당근 케일 5g씩", "감자 80g"],
  "steps": ["감자는 껍질을 벗겨 준비한다.", "..."],
  "tips": ["감자에 수분이 너무 있으면..."],
  "image_file": "IMG_3658.jpg"
}
```

## 새 레시피 추가하기

1. `src/data/recipes.json` 파일 열기
2. 배열 끝에 새 레시피 객체 추가:
   ```json
   {
     "id": 77,
     "title": "새 레시피 이름",
     "age": "6개월부터",
     "category": "초기",
     "ingredients": ["재료1", "재료2"],
     "steps": ["단계1", "단계2"],
     "tips": ["팁1"],
     "image_file": ""
   }
   ```
3. 저장 후 새로고침

## 브라우저 지원

- Chrome 80+
- Safari 14+
- Firefox 80+
- Edge 80+
- 모바일 브라우저 (iOS Safari, Chrome for Android)

## PWA 설치

### Android
1. Chrome에서 앱 접속
2. "홈 화면에 추가" 배너 클릭 또는
3. 메뉴(⋮) → "앱 설치" 또는 "홈 화면에 추가"

### iOS
1. Safari에서 앱 접속
2. 공유 버튼(⬆️) 탭
3. "홈 화면에 추가" 선택

## 라이선스

MIT License
