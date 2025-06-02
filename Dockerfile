# Dockerfile
# base image로 node image 사용
FROM node:22.15.0

# 검증애 필요한 런타임 의존성 설치
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    libssl-dev \
    net-tools \
    curl \
    wget \
    procps \
    dnsutils \  
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# /app 디렉토리를 작업디렉토리로 설정 및 이동
WORKDIR /app

# 현재 디렉토리(/app)에 package.json과 yarn.lock 파일 복사
COPY package.json yarn.lock ./

# yarn 설치 및 install
RUN yarn

# 프로젝트를 현재 디렉토리에 복사
COPY . .

# 리스닝 포트 8080으로 설정
EXPOSE 8080

# 개발서버 실행
CMD ["yarn", "dev"]