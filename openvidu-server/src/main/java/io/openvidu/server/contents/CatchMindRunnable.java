package io.openvidu.server.contents;

import com.google.gson.JsonObject;
import io.openvidu.client.internal.ProtocolElements;
import io.openvidu.server.core.Participant;
import io.openvidu.server.rpc.RpcNotificationService;

import java.util.*;

public class CatchMindRunnable implements Runnable{

    public boolean running = true;

    static String[] wordList = {
            "원피스", "나루토", "이누야샤", "명탐정 코난", "슬램덩크", "드래곤볼", "토토로", "시간을 달리는 소녀", "하울의 움직이는성", "너의 이름은",
            "센과치히로의 행방불명", "개구리 중사 케로로", "무적콧털 보보보", "달려라 왕바우", "어벤저스", "반지의 제왕", "해리포터", "캐리비안의 해적",
            "착신아리", "아바타", "실미도", "범죄와의 전쟁", "범죄도시", "스파이더맨", "포켓몬스터", "황해", "여고괴담", "주온", "가시두더지","개",
            "개미핥기","개코원숭이","고라니","고래","고릴라","고슴도치","고양이","곰", "기린","나무늘보","낙타","날다람쥐","너구리","늑대","다람쥐",
            "당나귀","돌고래","돼지", "두더지","말","멧돼지","물개","바다표범","박쥐","반달가슴곰","벵골호랑이","북극곰","북극여우", "불독","사막여우",
            "사슴","사자","생쥐","수달","스컹크","알파카","여우","염소", "오랑우탄","오소리","원숭이","족제비","청설모","치와와","치타","침팬지",
            "캥거루","코끼리", "코뿔소","코알라","토끼","펭귄","표범","호랑이", "어벤져스", "아바타", "타이타닉", "스타워즈", "쥬라기 월드", "분노의 질주",
            "겨울왕국", "해리 포터", "미녀와 야수", "인크레더블", "아이언맨", "미니언즈", "캡틴 아메리카", "아쿠아맨", "트랜스포머", "다크 나이트 라이즈",
            "토이 스토리", "캐리비안의 해적", "이상한 나라의 앨리스", "라이온 킹", "니모를 찾아서", "바람과 함께 사라지다", "사운드 오브 뮤직", "ET",
            "명량", "극한직업", "신과함께", "국제시장", "베테랑", "도둑들", "7번방의 선물", "암살", "알라딘", "광해, 왕이 된 남자", "부산행", "해운대",
            "괴물", "왕의 남자", "인터스텔라", "인셉션", "기생충", "보헤미안 랩소디", "검사외전", "엑시트", "내부자들", "국가대표", "디워", "히말라야",
            "밀정", "써니", "스파이더맨", "터널", "죽마고우", "청출어람", "환골탈태", "수어지교", "상전벽해", "사면초가", "진퇴양난" ,
            "칠전팔기", "이심전심", "일장춘몽", "토사구팽", "원숭이도 나무에 떨어진다", "소 잃고 외양간 고친다.", "발 없는 말이 천리 간다.",
            "지렁이도 밟으면 꿈틀한다.", "누워서 떡 먹기", "윗물이 맑아야 아랫물도 맑다.", "개똥도 약에 쓰려면 없다.", "백지장도 맞들면 낫다",
            "병 주고 약 준다", "사공이 많으면 배가 산으로 간다", "서당 개 삼년이면 풍월을 읊는다.", "세 살 버릇 여든까지 간다.", "수박 겉 핥기",
            "BTS", "빅뱅", "제시", "사스케", "간달프", "강호동", "박명수", "마동석", "장첸", "주현영", "아이유", "소녀시대", "유노윤호", "SG워너비",
            "홍진호", "페이커", "메시", "윤도현", "임요환", "기안84", "박나래", "유세윤", "조로", "베지터", "헤르미온느", "김연경"
    };

    private Set<Participant> participants;
    static RpcNotificationService rpcNotificationService;
    // 생성자
    public CatchMindRunnable(Set<Participant> participants, RpcNotificationService rnfs) {
        this.participants = participants;
        this.rpcNotificationService = rnfs;
    }
    // 종료
    public void terminate() {
        running = false;
    }

    @Override
    public void run() {
        ArrayList<String> randWords = new ArrayList<>(Arrays.asList(wordList));
        Collections.shuffle(randWords);
        ArrayList<Participant> randParticipants = new ArrayList<>(participants);
        Collections.shuffle(randParticipants);

        // 이미지 저장용
        HashMap<String, String> imageMap = new HashMap<>();

        try {
            JsonObject data = new JsonObject();
            JsonObject params = new JsonObject();
            // signal:game 추가
            String temp = "signal:game";
            params.addProperty("type", temp);


            // 사람 index
            int pIdx = 0;
            int peopleCnt = randParticipants.size();

            while (running) {
                if (pIdx >= peopleCnt) {
                    pIdx -= peopleCnt;
                }
                // 제시어
                String word = randWords.get(0);
                data.addProperty("word", word);
                // 현재 차례
                data.addProperty("curStreamId", randParticipants.get(pIdx).getParticipantPublicId());
                data.addProperty("gameStatus", 2);

                params.add("data", data);

                // 브로드 캐스트
                for (Participant p : participants) {
                    rpcNotificationService.sendNotification(p.getParticipantPrivateId(),
                            ProtocolElements.PARTICIPANTSENDMESSAGE_METHOD, params);
                }
                pIdx++;

                
                // 그리는 시간 10초
                Thread.sleep(10000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }


    }
}
