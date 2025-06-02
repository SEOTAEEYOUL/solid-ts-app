## solid-ts-app

## 기동
```
yarn start or yarn dev
```


## Docker Build

### Docker hub 에 Repository 를 만든다.

### docker-build-dockerhub.ps1

#### 정보 수정

#### 수행
- docker 빌드 후 docker Hub repository 에 등록(docker push)
```
./docker-build-dockerhub.ps1 v0.0.5
```

### 배포
- manifests 에서 아래 순서대로 수행

1. ConfigMap
    - kubectl apply -f solid-ts-app-cm.yaml

2. Deployments
    - kubectl apply -f solid-ts-app-deploy.yaml

3. Service
    - kubectl apply -f solid-ts-app-svc.yaml

4. Ingress
    - kubectl apply -f solid-ts-app-ing.yaml

### 배포 상태 보기
kubectl get cm,deploy,svc,ep,ing -lapp=solid-ts-app