FROM node:22-alpine AS builder

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# package.json과 package-lock.json 파일을 컨테이너로 복사
COPY package*.json ./

# 모든 의존성 패키지 설치
RUN npm ci

# 소스 코드 복사
COPY . .

# TypeScript 빌드
RUN npm run build

# 개발 의존성 포함 설치
RUN npm ci && npm cache clean --force

# 프로덕션 이미지 생성
FROM node:22-alpine AS production

WORKDIR /app

# 빌드된 파일과 필요한 파일들 복사
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/certs ./certs

# 7777 포트 노출
EXPOSE 7777

# 프로덕션 서버 실행 
CMD ["npm", "run", "start:prod"]