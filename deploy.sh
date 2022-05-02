# jenkins의 기존 경로는 /var/lib/jenkins/workspace/arcade 이다.
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++백엔드 properties 복사하기"
cp /home/ubuntu/properties/*.properties /var/lib/jenkins/workspace/arcade/backend/src/main/resources/
echo "+++++++++++++++++++++++++++++++++++"

# --- 백엔드 ----

# 기존 백엔드 컨테이너 멈추고 지우기
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++백엔드 docker 컨테이너 멈추고 지우기"
docker stop arcade_backend
docker rm arcade_backend
echo "+++++++++++++++++++++++++++++++++++"

# 기존 백엔드 이미지 지우기
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++백엔드 도커 이미지 지우기"
docker rmi arcade_backend
echo "+++++++++++++++++++++++++++++++++++"

# 새로운 백엔드 이미지 만들기
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++백엔드 도커 이미지 새로 만들기"
pwd
docker build -t arcade_backend backend
echo "+++++++++++++++++++++++++++++++++++"
# 새로운 백엔드 컨테이너 실행하기
echo "++++++++++백엔드 도커 새로만든 이미지로 컨테이너 실행하기"
docker run -d --name arcade_backend -p 8080:8080 arcade_backend
echo "+++++++++++++++++++++++++++++++++++"

# ---- 프론트엔드 ----
# 1. frontend 폴더로 이동
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++프론트엔드 폴더로 이동"
cd frontend
echo "+++++++++++++++++++++++++++++++++++"
# 2. npm install & npm run build
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++노드랑 npm 버전 확인"
node -v
npm -v
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++npm i & npm run build"
npm i
npm run build
echo "+++++++++++++++++++++++++++++++++++"
# 3. 기존에 있던 폴더를 지운다.
echo "++++++++++기존의 opt/openvidu 에 있는 프론트 빌드 파일 제거"

sudo rm -f /opt/openvidu/front_build/index.html
sudo rm -rf /opt/openvidu/front_build/assets
echo "+++++++++++++++++++++++++++++++++++"
# 4. 빌드한 결과물을 복사한다.
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++프론트 빌드한 결과물 복사"
sudo cp dist/index.html /opt/openvidu/front_build
sudo cp -r dist/assets /opt/openvidu/front_build
echo "+++++++++++++++++++++++++++++++++++"

# --- openvidu ----
# 1. home/ubuntu/openvidu/openvidu-server 폴더 제거(갈아끼울거임)
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++home/ubuntu/openvidu/openvidu-server 폴더 제거(갈아끼울거임)"
sudo rm -rf /home/ubuntu/openvidu/openvidu-server
echo "+++++++++++++++++++++++++++++++++++"
# 2. openvidu-server 폴더 복붙
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++openvidu-server 폴더 복붙"
pwd
sudo cp -r openvidu-server /home/ubuntu/openvidu/openvidu-server
echo "+++++++++++++++++++++++++++++++++++"
# 3. 메이븐 빌드
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++/home/ubuntu/openvidu에서 한번 메이븐 빌드"
sudo chmod -R 777 /home/ubuntu
cd /home/ubuntu/openvidu
pwd
sudo mvn install -DskipTests
echo "++++++++++/home/ubuntu/openvidu/openvidu-server로 이동해서 메이븐 빌드"
cd openvidu-server
echo "++++++++++"
sudo mvn install -DskipTests
echo "+++++++++++++++++++++++++++++++++++"
# 4. 도커경로로 이동하기
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++openvidu-server 도커 폴더로 이동"
pwd
cd docker/openvidu-server
echo "+++++++++++++++++++++++++++++++++++"
# 5. openvidu-server 이미지 빌드
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++openvidu-server 이미지 빌드하기"
sudo chmod +x create_image.sh
./create_image.sh arcade
echo "+++++++++++++++++++++++++++++++++++"
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++필요없는 도커 이미지들 지우기"
docker image prune -f
echo "+++++++++++++++++++++++++++++++++++"
# --- openvidu restart
# cd /opt/openvidu
# ./openvidu restart