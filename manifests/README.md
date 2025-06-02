# manifests

## Docker Build
```
./docker-build-dockerhub.ps1 "v0.0.2"
Dockerfile.nginx
There are a total of 1 arguments
Argument  0 is v0.0.2
Authenticating with existing credentials...
Login Succeeded
Tags is  v0.0.2
docker build --tag taeeyoul/react-ts-app-nginx:v0.0.2 -f Dockerfile.nginx .
[+] Building 4.1s (18/18) FINISHED                                                                            docker:default
 => [internal] load build definition from Dockerfile.nginx                                                              0.0s
 => => transferring dockerfile: 939B                                                                                    0.0s 
 => [internal] load metadata for docker.io/library/nginx:stable-alpine                                                  0.8s 
 => [internal] load metadata for docker.io/library/node:20-alpine                                                       0.8s 
 => [internal] load .dockerignore                                                                                       0.0s
 => => transferring context: 71B                                                                                        0.0s 
 => [build 1/6] FROM docker.io/library/node:20-alpine@sha256:8bda036ddd59ea51a23bc1a1035d3b5c614e72c01366d989f4120e8ad  0.0s 
 => [internal] load build context                                                                                       0.0s 
 => => transferring context: 3.27kB                                                                                     0.0s 
 => [runtime 1/6] FROM docker.io/library/nginx:stable-alpine@sha256:d2c11a1e63f200585d8225996fd666436277a54e8c0ba728fa  0.0s 
 => CACHED [build 2/6] WORKDIR /app                                                                                     0.0s 
 => CACHED [build 3/6] COPY package.json yarn.lock ./                                                                   0.0s 
 => CACHED [build 4/6] RUN --mount=type=cache,target=/usr/local/share/.cache/yarn     yarn install --frozen-lockfile    0.0s 
 => [build 5/6] COPY . .                                                                                                0.1s 
 => [build 6/6] RUN yarn build                                                                                          2.5s
 => CACHED [runtime 2/6] COPY --from=build /app/dist /usr/share/nginx/html                                              0.0s
 => CACHED [runtime 3/6] RUN mkdir -p /usr/share/nginx/html/public                                                      0.0s
 => CACHED [runtime 4/6] RUN mv /usr/share/nginx/html/*.png /usr/share/nginx/html/public                                0.0s
 => [runtime 5/6] RUN rm /etc/nginx/conf.d/default.conf                                                                 0.2s
 => [runtime 6/6] COPY nginx/nginx.conf /etc/nginx/conf.d                                                               0.1s
 => exporting to image                                                                                                  0.1s
 => => exporting layers                                                                                                 0.1s
 => => writing image sha256:a3b125ce657ba2826cbc1fca18ed6ecc5c2e4118616633c0b9d87f881d2a9161                            0.0s 
 => => naming to docker.io/taeeyoul/react-ts-app-nginx:v0.0.2                                                           0.0s 

View build details: docker-desktop://dashboard/build/default/default/bhjj1jxfdun72tvh061mt6m0s

What's Next?
  View a summary of image vulnerabilities and recommendations → docker scout quickview
docker push taeeyoul/react-ts-app-nginx:v0.0.2
The push refers to repository [docker.io/taeeyoul/react-ts-app-nginx]
6b2b76a11f2d: Pushed
10e772bd56a8: Pushed
3bfe0581f1ff: Layer already exists
050757e4434a: Layer already exists
8fb03065e121: Layer already exists 
3e8cf4ce5939: Layer already exists
f17463b2e0eb: Layer already exists
d9eb3928f113: Layer already exists
c0ada042e981: Layer already exists
b886da31f806: Layer already exists
8027b117c757: Layer already exists
6a9b6a160986: Layer already exists
994456c4fd7b: Layer already exists
v0.0.2: digest: sha256:8e07ea9d13608e1754e01c6a7fd709db794fda69c2b08f3a73436a89f9d6613c size: 3029
✅ Successfully deployed v0.0.2
```

## Apply
```
PS > kubectl apply -f react-ts-app-deploy.yaml
deployment.apps/react-ts-app configured
PS > kubectl apply -f react-ts-app-svc.yaml   
service/react-ts-app created
PS > kubectl apply -f react-ts-app-tgb.yaml
targetgroupbinding.elbv2.k8s.aws/react-ts-app-tgb created
PS > kubectl get pods,svc,targetgroupbinding -lapp=react-ts-app
NAME                                READY   STATUS    RESTARTS   AGE
pod/react-ts-app-7b4446484b-vw95p   1/1     Running   0          113s

NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/react-ts-app   ClusterIP   172.20.195.58   <none>        8080/TCP   97s

NAME                                                SERVICE-NAME   SERVICE-PORT   TARGET-TYPE   AGE
targetgroupbinding.elbv2.k8s.aws/react-ts-app-tgb   react-ts-app   8080           ip            91s
```

## kubectl logs -f -lapp=react-ts-app
```
kubectl logs -f -lapp=react-ts-app
2025/04/02 14:51:07 [notice] 1#1: using the "epoll" event method
2025/04/02 14:51:07 [notice] 1#1: nginx/1.26.3
2025/04/02 14:51:07 [notice] 1#1: built by gcc 13.2.1 20240309 (Alpine 13.2.1_git20240309)
2025/04/02 14:51:07 [notice] 1#1: OS: Linux 5.10.233-223.887.amzn2.x86_64
2025/04/02 14:51:07 [notice] 1#1: getrlimit(RLIMIT_NOFILE): 1048576:1048576
2025/04/02 14:51:07 [notice] 1#1: start worker processes
2025/04/02 14:51:07 [notice] 1#1: start worker process 20
2025/04/02 14:51:07 [notice] 1#1: start worker process 21
10.70.19.69 - - [02/Apr/2025:14:51:21 +0000] "GET / HTTP/1.1" 200 464 "-" "ELB-HealthChecker/2.0"
10.70.18.249 - - [02/Apr/2025:14:51:21 +0000] "GET / HTTP/1.1" 200 464 "-" "ELB-HealthChecker/2.0"
10.70.18.249 - - [02/Apr/2025:14:51:36 +0000] "GET / HTTP/1.1" 304 0 "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36"
```