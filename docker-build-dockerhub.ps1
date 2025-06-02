# -----------------------------------------------------------------------------
# 파라미터 검증
# param(
#     [Parameter(Mandatory=$true)]
#     [string]$Tag
# )

# 초기화화
$ImageName="solid-ts-app-nginx"
$ScriptName="Dockerfile.nginx"
Write-Host "$ScriptName"
write-host "There are a total of $($args.count) arguments"

for ( $i = 0; $i -lt $args.count; $i++ ) {
    write-host "Argument  $i is $($args[$i])"
} 


# test -n "$6" && echo CLUSTER is "$6" || "echo CLUSTER is not set && exit"
if ($($args[0]) -eq $null) {
    docker login

    Write-Host "Tags is not set"
    Write-Host "Usage ./${ScriptName} 1.0.0"
    Write-Host "      ./${ScriptName} 1.0.1"
    Write-Host "      ./${ScriptName} 1.1.0"  
    Write-Host "springmysql tags"
    curl -s https://registry.hub.docker.com/v2/repositories/taeeyoul/${ImageName} | jq '.results[].name'
    return ;
}


# 도커 로그인 체크
if (-not (docker info 2>&1 | Out-Null)) {
  docker login -u taeeyoul
  if (-not $?) {
      Write-Error "Docker login failed"
      exit 1
  }
}

$Tag=$($args[0])

Write-Host "Tags is "$Tag

# 빌드 및 푸시
try {
  Write-Host "docker build --tag taeeyoul/${ImageName}:${Tag} -f ${ScriptName} ."
  docker build --tag taeeyoul/${ImageName}:${Tag} -f ${ScriptName} .

  docker images | grep taeeyoul/${ImageName}:${Tag}

  Write-Host "docker push taeeyoul/${ImageName}:${Tag}"
  docker push "taeeyoul/${ImageName}:${Tag}"
}
catch {
  Write-Error "Docker build or push failed: $_"
  exit 1
}

# 성공 메시지
Write-Host "✅ Successfully deployed $Tag" -ForegroundColor Green

# -----------------------------------------------------------------------------