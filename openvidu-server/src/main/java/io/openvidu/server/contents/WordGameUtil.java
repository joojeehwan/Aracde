package io.openvidu.server.contents;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class WordGameUtil {

    // 단어는 추후에 추가해야 함
    static String[] proverb = { "죽마고우", "청출어람", "환골탈태", "수어지교", "상전벽해", "사면초가", "진퇴양난" ,
            "칠전팔기", "이심전심", "일장춘몽", "토사구팽", "원숭이도 나무에 떨어진다", "소 잃고 외양간 고친다.", "발 없는 말이 천리 간다.",
            "지렁이도 밟으면 꿈틀한다.", "누워서 떡 먹기", "윗물이 맑아야 아랫물도 맑다.", "개똥도 약에 쓰려면 없다.", "백지장도 맞들면 낫다",
            "병 주고 약 준다", "사공이 많으면 배가 산으로 간다", "서당 개 삼년이면 풍월을 읊는다.", "세 살 버릇 여든까지 간다.", "수박 겉 핥기"
    };

    static String[] movie = { "원피스", "나루토", "이누야샤", "명탐정 코난", "슬램덩크", "드래곤볼", "토토로", "시간을 달리는 소녀",
            "하울의 움직이는성", "너의 이름은", "센과치히로의 행방불명", "개구리 중사 케로로", "무적콧털 보보보", "달려라 왕바우", "어벤저스",
            "반지의 제왕", "해리포터", "캐리비안의 해적", "착신아리", "아바타", "실미도", "범죄와의 전쟁", "범죄도시", "스파이더맨", "포켓몬스터",
            "황해", "여고괴담", "주온"
    };

    static String[] game = { "메이플스토리", "던전앤파이터", "신지드", "티모", "오버로드", "저글링", "질럿", "드라군", "벌처", "포트리스",
            "피파", "배틀그라운드", "구스구스덕", "바람의나라", "로블록스", "오목", "리니지"
    };

    static String[] life = { "티라노사우르스", "문어", "얼룩말", "바퀴벌레", "독수리", "잠자리", "캥거루", "개미핥기", "코끼리", 
            "미어캣", "해바라기", "벚꽃", "사자", "호랑이", "침팬치", "흰수염고래", "상어", "해파리", "플랑크톤", "모기", "벌", 
            "장수풍뎅이", "나비", "고양이", "펭귄", "나무늘보", "고라니", "코알라", "기린", "개미", "개구리"
    };

    static String[] character = { "BTS", "빅뱅", "제시", "사스케", "간달프", "강호동", "박명수", "마동석", "장첸", "주현영",
            "아이유", "소녀시대", "유노윤호", "SG워너비", "홍진호", "페이커", "메시", "윤도현", "임요환", "기안84", "박나래",
            "유세윤", "조로", "베지터", "헤르미온느", "김연경"
    };
    // index - array 매핑
    private Map<Integer, String[]> category = Map.of(
            0, proverb, 1, movie, 2, game, 3, life, 4, character);


    private String[] keyList = {"속담", "영화", "게임", "생물", "인물"};


    // 카테고리별
    public List<String> takeWord(int idx) {

        List<String> categ = Arrays.asList(category.get(idx));
        return categ;
    }

    // 모든 단어
    public List<String> takeAllWord() {
        List<String> allWord = new ArrayList<>();

        for (int i = 0; i < keyList.length; i++) {
            List<String> categWord = takeWord(i);
            allWord.addAll(categWord);
        }
        System.out.println("allWord: " + allWord);
        return allWord;
    }
}
