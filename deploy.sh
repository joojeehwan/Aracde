# jenkins의 기존 경로는 /var/lib/jenkins/workspace/arcade 이다.
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++백엔드 properties 복사하기"
sudo cp /home/ubuntu/properties/*.properties /var/lib/jenkins/workspace/arcade/backend/src/main/resources/
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


sudo rm -rf /opt/openvidu/front_build/build
echo "+++++++++++++++++++++++++++++++++++"
# 4. 빌드한 결과물을 복사한다.
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++프론트 빌드한 결과물 복사"
sudo cp -r build /opt/openvidu/front_build
echo "+++++++++++++++++++++++++++++++++++"

# --- openvidu ----
# openvidu 에서 mvn install은 딱 한번만 해주면 된다.
# 이때 openvidu-client, java client 등의 jar들이 생기고 이 jar파일들은 계정/.m2 폴더에 생성된다.
# 그 jar 파일들을 openvidu-server jar만들때 쓴다. 그래서 초기에 한번만 해주면 매번 배포할 때마다 해주지 않아도 된다.
# 심지어 git clone 받은 경로로 가서 openvidu-server 폴더를 갈아끼우지 않아도 된다.
# 1. 메이븐 빌드
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++openvidu-server 메이븐 빌드"
pwd
cd ../openvidu-server
pwd
echo "++++++++++"
sudo mvn install -DskipTests
echo "+++++++++++++++++++++++++++++++++++"
# 4. 도커경로로 이동하기
echo "+++++++++++++++++++++++++++++++++++"
echo "++++++++++openvidu-server 도커 폴더로 이동"
cd docker/openvidu-server
pwd
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