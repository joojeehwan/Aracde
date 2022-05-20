package io.openvidu.server.contents;

import java.util.*;
import java.util.stream.Collectors;

public class WordGameUtil {

    // 단어는 추후에 추가해야 함
    static String[] proverb = { "죽마고우", "청출어람", "원숭이도 나무에서 떨어진다", "소 잃고 외양간 고친다", "발 없는 말이 천리 간다",
            "지렁이도 밟으면 꿈틀한다", "누워서 떡 먹기", "윗물이 맑아야 아랫물도 맑다", "병 주고 약 준다", "세 살 버릇 여든까지 간다", "수박 겉 핥기",
            "고래 싸움에 새우 등 터진다", "빈 수레가 요란하다", "등잔 밑이 어둡다", "눈 가리고 아웅", "바늘 가는데 실 간다", "사촌이 땅을사면 배가 아프다",
            "뛰는 놈 위에 나는 놈", "내 코가 석자", "원수는 외나무다리에서 만난다"
    };

    static String[] movie = { "명탐정 코난", "슬램덩크", "드래곤볼", "어벤저스", "반지의 제왕", "해리포터", "범죄와의 전쟁","스파이더맨",
            "신과함께", "겨울왕국", "광해", "해운대", "기생충", "인터스텔라", "아이언맨", "설국열차", "관상", "닥터스트레인지",
            "타짜", "알라딘", "트랜스포머", "매트릭스", "곡성", "아저씨", "킹스맨", "인셉션", "타이타닉", "분노의 질주"
    };

    static String[] game = { "피파", "배틀그라운드", "구스구스덕", "바람의나라", "오버워치", "어몽어스", "카트라이더",
            "가위바위보", "얼음땡", "무궁화 꽃이 피었습니다", "윷놀이", "강강술래", "공기놀이", "딱지치기", "제기차기", "줄다리기",
            "닭싸움", "마피아", "아이엠그라운드", "숨바꼭질", "참참참", "후라이팬놀이", "ABC", "팽이치기"
    };

    static String[] life = { "닭", "코끼리", "토끼", "강아지", "고양이", "원숭이", "뱀", "쥐", "말", "돼지", "악어", "미어캣", "펭귄",
            "기린", "목도리도마뱀", "딱따구리", "복어", "개구리", "모기", "나무늘보", "고래", "양", "사자", "늑대"
    };

    static String[] job = { "판사", "경찰", "형사", "선생님", "교수", "요리사", "배달부", "택시기사", "버스기사", "군인", "아나운서",
            "모델", "가수", "댄서", "프로게이머", "미용사", "무당", "지휘자", "의사", "어부", "소방관", "헬스트레이너", "화가", "태권도 선수",
            "사진작가", "축구 선수", "개그맨", "프로그래머", "상담원"
    };

    static String[] sports = { "달리기", "펜싱", "씨름", "투포환", "리듬체조", "피겨스케이팅", "배드민턴", "에어로빅", "요가", "탁구", "배구",
            "농구", "레슬링", "야구", "등산", "클라이밍", "축구", "골프", "수영", "양궁", "스키", "태권도", "권투", "사격", "볼링", "검도",
            "역도"
    };
    // index - array 매핑
    private Map<Integer, String[]> category = Map.of(

            0, proverb, 1, movie, 2, game, 3, life, 4, job, 5, sports);

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
