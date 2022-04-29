# jenkins의 기존 경로는 /var/lib/jenkins/workspace/arcade 이다.
cp /home/ubuntu/properties/*.properties /var/lib/jenkins/workspace/arcade/backend/src/main/resources/

# --- 백엔드 ----

# 기존 백엔드 컨테이너 멈추고 지우기
docker stop arcade_backend
docker rm arcade_backend

# 기존 백엔드 이미지 지우기
docker rmi arcade_backend

# 새로운 백엔드 이미지 만들기

# 새로운 백엔드 컨테이너 실행하기

# ---- 프론트엔드 ----
# 1. frontend 폴더로 이동
cd frontend
# 2. npm install & npm run build
npm i
npm run build
# 3. 기존에 있던 폴더를 지운다.

# 4. 빌드한 결과물을 복사한다.
cp -r dist/ /opt/openvidu/front_build


# --- openvidu ----
# 1. openvidu-server 폴더로 이동
cd ../openvidu-server
# 2. 메이븐 빌드
mvn install -DskipTests
# 3. 도커경로로 이동하기
cd docker/openvidu-server
# 4. 루트 권한
sudo su
# 5. openvidu-server 이미지 빌드
./create_image.sh arcade


# --- openvidu restart
cd /opt/openvidu
./openvidu restart