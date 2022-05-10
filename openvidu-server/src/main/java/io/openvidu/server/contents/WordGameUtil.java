package io.openvidu.server.contents;

import java.util.*;
import java.util.stream.Collectors;

public class WordGameUtil {

    // 단어는 추후에 추가해야 함
    static String[] proverb = { "죽마고우", "청출어람", "환골탈태", "수어지교", "상전벽해", "사면초가", "진퇴양난" ,
            "칠전팔기", "이심전심", "일장춘몽", "토사구팽", "원숭이도 나무에서 떨어진다", "소 잃고 외양간 고친다.", "발 없는 말이 천리 간다.",
            "지렁이도 밟으면 꿈틀한다", "누워서 떡 먹기", "윗물이 맑아야 아랫물도 맑다", "개똥도 약에 쓰려면 없다.", "백지장도 맞들면 낫다",
            "병 주고 약 준다", "사공이 많으면 배가 산으로 간다", "서당 개 삼년이면 풍월을 읊는다", "세 살 버릇 여든까지 간다", "수박 겉 핥기"
    };

    static String[] movie = { "원피스", "나루토", "이누야샤", "명탐정 코난", "슬램덩크", "드래곤볼", "토토로", "시간을 달리는 소녀",
            "하울의 움직이는성", "너의 이름은", "센과치히로의 행방불명", "개구리 중사 케로로", "무적콧털 보보보", "달려라 왕바우", "어벤저스",
            "반지의 제왕", "해리포터", "캐리비안의 해적", "착신아리", "아바타", "실미도", "범죄와의 전쟁", "범죄도시", "스파이더맨", "포켓몬스터",
            "황해", "여고괴담", "주온", "신과함께", "겨울왕국", "광해", "해운대", "기생충", "인터스텔라", "아이언맨", "설국열차", "관상", "타짜",
            "명량", "알라딘", "트랜스포머", "매트릭스", "곡성", "아저씨", "킹스맨", "인셉션", "미녀는 괴로워", "타이타닉", "분노의 질주"
    };

    static String[] game = { "메이플스토리", "던전앤파이터", "신지드", "티모", "오버로드", "저글링", "질럿", "드라군", "벌처", "포트리스",
            "피파", "배틀그라운드", "구스구스덕", "바람의나라", "로블록스", "오목", "리니지", "오버워치", "어몽어스", "스팀", "카트라이더",
            "크레이지아케이드", "마인크래프트", "모두의 마블"
    };

    static String[] life = { "티라노사우르스", "문어", "얼룩말", "바퀴벌레", "독수리", "잠자리", "캥거루", "개미핥기", "코끼리", 
            "미어캣", "해바라기", "벚꽃", "사자", "호랑이", "침팬치", "흰수염고래", "상어", "해파리", "플랑크톤", "모기", "벌", 
            "장수풍뎅이", "나비", "고양이", "펭귄", "나무늘보", "고라니", "코알라", "기린", "개미", "개구리", "쿼카", "강아지",
            "개", "병아리", "돼지"
    };

    static String[] character = { "BTS", "빅뱅", "제시", "사스케", "간달프", "강호동", "박명수", "마동석", "장첸", "주현영",
            "아이유", "소녀시대", "유노윤호", "SG워너비", "홍진호", "페이커", "메시", "윤도현", "임요환", "기안84", "박나래",
            "유세윤", "조로", "베지터", "헤르미온느", "김연경", "트와이스", "펭수", "피카츄", "뽀로로", "나문희"
    };

    static String[] music = { "Gee", "사랑했나봐", "마지막 인사", "벌써 일년", "하루 하루", "So Hot", "거짓말", "Tell me", "사랑앓이",
            "총맞은것처럼", "내사람", "벚꽃엔딩", "밤편지", "야생화", "봄날", "금요일에 만나요", "선물", "좋니", "CHEER UP", "널 사랑하지 않아",
            "썸", "끝사랑", "자니", "걱정말아요 그대", "여수 밤바다", "너랑 나", "마지막처럼", "다시 여기 바닷가", "살짝 설렜어", "롤린", "Next Level",
            "신호등", "내 손을 잡아", "어떻게 이별까지 사랑하겠어 널 사랑하는 거지", "흔들리는 꽃들 속에서 네 샴푸향이 느껴진거야", "낙하"
    };
    // index - array 매핑
    private Map<Integer, String[]> category = Map.of(

            0, proverb, 1, movie, 2, game, 3, life, 4, character, 5, music);

    // 카테고리별
    public ArrayList<String> takeWord(int categoryIdx, int count) {
        // 카테고리에 맞는 단어 목록 가져오고 랜덤으로 섞음
        List<String> categoryWords = Arrays.asList(category.get(categoryIdx));
        Collections.shuffle(categoryWords);

        // 반환해줄 단어 목록
        ArrayList<String> pickedWords = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            pickedWords.add(categoryWords.get(i));
        }
        return pickedWords;
    }

    // 모든 단어
    public ArrayList<String> takeAllWord(int count) {

        List<String> allWords = new ArrayList<>();
        // 6개 카테고리의 모든 단어를 가져온다.
        for (int i = 0; i < 6; i++) {
            allWords.addAll(Arrays.asList(category.get(i)));
        }
        // 섞는다.
        Collections.shuffle(allWords);

        // 반환해줄 단어 목록
        ArrayList<String> pickedWords = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            pickedWords.add(allWords.get(i));
        }
        return pickedWords;
    }
}
