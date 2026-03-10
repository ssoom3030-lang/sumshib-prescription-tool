# 숨쉬는한의원 점막 처방툴

## 로컬 실행

```bash
npm install
npm run dev
```

## GitHub Pages 배포

이 프로젝트는 GitHub Pages 배포용 설정이 포함되어 있습니다.

1. GitHub 저장소를 생성하고 이 프로젝트를 업로드합니다.
2. 기본 브랜치를 `main`으로 맞춥니다.
3. 저장소의 **Settings → Pages → Build and deployment** 에서 **Source** 를 **GitHub Actions** 로 변경합니다.
4. `main` 브랜치에 푸시하면 `.github/workflows/deploy-pages.yml` 이 자동 실행되어 배포됩니다.

배포 주소는 보통 다음 형태입니다.

```
https://<github-username>.github.io/<repository-name>/
```

## 빌드

```bash
npm run build
```

`vite.config.ts` 에 `base: './'` 가 설정되어 있어 GitHub Pages 하위 경로에서도 정적 파일이 정상 로드됩니다.
