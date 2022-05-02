package com.ssafy.arcade.game;

import com.ssafy.arcade.common.exception.CustomException;
import com.ssafy.arcade.common.exception.ErrorCode;
import com.ssafy.arcade.game.entity.GameRoom;
import com.ssafy.arcade.game.repositroy.GameRoomRepository;
import com.ssafy.arcade.user.UserService;
import com.ssafy.arcade.user.entity.User;
import com.ssafy.arcade.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class GameService {

    private final GameRoomRepository gameRoomRepository;

    // Room 생성
    public String createInviteCode() {

        // 일단 무조건 요청하는대로 방 생성하는걸로

        String inviteCode = createRandString();
        // 혹시나 하는 중복 제거.
        while (true) {
            GameRoom gameRoom = gameRoomRepository.findByInviteCodeAndIsDel(inviteCode, false).orElse(null);
            if (gameRoom == null) {
                break;
            }
            inviteCode = createRandString();
        }
        GameRoom gameRoom = GameRoom.builder().
                inviteCode(inviteCode).currentMember(1).isDel(false).build();
        gameRoomRepository.save(gameRoom);

        return inviteCode;
    }

    // 초대코드 일치여부 확인
    public void enterGameRoom(String inviteCode) {
        // 해당 inviteCode를 갖는 gameRoom이 존재하지 않는경우
        System.out.println("inviteCode: " + inviteCode);
        GameRoom gameRoom = gameRoomRepository.findByInviteCodeAndIsDel(inviteCode, false).orElseThrow(() ->
                new CustomException(ErrorCode.UNMATHCED_CODE));

        Integer curMember = gameRoom.getCurrentMember();
        // 인원 초과 시,
        if (curMember >= 6) {
            throw new CustomException(ErrorCode.ALREADY_FULL);
        }
        // 인원 추가
        gameRoom.addMember();
        gameRoomRepository.save(gameRoom);
    }
    
    // 10자리 임시 코드 생성
    protected String createRandString() {
        char[] temp = new char[10];
        for (int i = 0; i < temp.length; i++) {
            // 0 또는 1
            int div = (int)Math.floor(Math.random() * 3);
            // div가 0이면 숫자, 1이면 알파벳 대문자, 2이면 알파벳 소문자
            if (div == 0) {
                temp[i] = (char)(Math.random()*10 + '0');
            } else if (div == 1) {
                temp[i] = (char)(Math.random()*26 + 'A');
            } else {
                temp[i] = (char)(Math.random()*26 + 'a');
            }
        }
        return new String(temp);
    }
}
