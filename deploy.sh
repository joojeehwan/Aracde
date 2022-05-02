# jenkins의 기존 경로는 /var/lib/jenkins/workspace/arcade 이다.
echo "++++++++++백엔드 properties 복사하기"
cp /home/ubuntu/properties/*.properties /var/lib/jenkins/workspace/arcade/backend/src/main/resources/

# --- 백엔드 ----

# 기존 백엔드 컨테이너 멈추고 지우기
echo "++++++++++백엔드 docker 컨테이너 멈추고 지우기"
docker stop arcade_backend
docker rm arcade_backend

# 기존 백엔드 이미지 지우기
echo "++++++++++백엔드 도커 이미지 지우기"
docker rmi arcade_backend

# 새로운 백엔드 이미지 만들기
echo "++++++++++백엔드 도커 이미지 새로 만들기"
pwd
docker build -t arcade_backend backend
# 새로운 백엔드 컨테이너 실행하기
echo "++++++++++백엔드 도커 새로만든 이미지로 컨테이너 실행하기"
docker run -d --name arcade_backend -p 8080:8080 arcade_backend

# ---- 프론트엔드 ----
# 1. frontend 폴더로 이동
echo "++++++++++프론트엔드 폴더로 이동"
cd frontend
# 2. npm install & npm run build
echo "++++++++++노드랑 npm 버전 확인"
node -v
npm -v

echo "++++++++++npm i & npm run build"
npm i
npm run build
# 3. 기존에 있던 폴더를 지운다.
echo "++++++++++기존의 opt/openvidu 에 있는 프론트 빌드 파일 제거"

sudo rm -f /opt/openvidu/front_build/index.html
sudo rm -rf /opt/openvidu/front_build/assets
# 4. 빌드한 결과물을 복사한다.
echo "++++++++++프론트 빌드한 결과물 복사"
sudo cp -r dist/index.html /opt/openvidu/front_build
sudo cp -r dist/assets /opt/openvidu/front_build


# --- openvidu ----
# 1. openvidu-server 폴더로 이동
echo "++++++++++openvidu 폴더로 이동"
cd ../openvidu-server
# 2. 메이븐 빌드
echo "++++++++++openvidu 메이븐 빌드중"
mvn install -DskipTests
# 3. 도커경로로 이동하기
echo "++++++++++openvidu-server 도커 폴더로 이동"
cd docker/openvidu-server
# 4. 루트 권한
echo "++++++++++루트권한 얻기"
sudo su
# 5. openvidu-server 이미지 빌드
echo "++++++++++openvidu-server 이미지 빌드하기"
chmod +x create_image.sh
./create_image.sh arcade


# --- openvidu restart
# cd /opt/openvidu
# ./openvidu restart