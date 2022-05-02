package com.ssafy.arcade.common.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

import static org.springframework.http.HttpStatus.*;

//import static org.springframework.http.HttpStatus.*;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* 400 BAD_REQUEST : 잘못된 요청 */
    INVALID_REFRESH_TOKEN(BAD_REQUEST, "리프레시 토큰이 유효하지 않습니다"),
    MISMATCH_REFRESH_TOKEN(BAD_REQUEST, "리프레시 토큰의 유저 정보가 일치하지 않습니다"),
    CANNOT_FOLLOW_MYSELF(BAD_REQUEST, "본인을 친구등록 할 수 없습니다."),
    CANNOT_ACCEPT_MYSELF(BAD_REQUEST, "요청자가 수락할 수 없습니다."),
    WRONG_DATA(BAD_REQUEST, "유효하지 않은 정보를 입력했습니다."),
    ALREADY_ACCEPT(BAD_REQUEST, "요청 수락이 이미 완료된 상태입니다."),

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    INVALID_AUTH_TOKEN(UNAUTHORIZED, "권한 정보가 없는 토큰입니다"),
    INVALID_AUTHORIZED(UNAUTHORIZED, "권한이 없습니다"),
    NOT_OUR_USER(UNAUTHORIZED, "회원이 아닙니다. 회원가입이 필요합니다."),
    UNAUTHORIZED_MEMBER(UNAUTHORIZED, "현재 내 계정 정보가 존재하지 않습니다"),
    UNMATHCED_CODE(UNAUTHORIZED, "초대 코드가 일치하지 않습니다."),

    // 403 Forbidden : 유효하지 않은 데이터
    INVALID_PASSWORD(FORBIDDEN, "비밀번호가 유효하지 않습니다."),
    INVALID_DATA(FORBIDDEN, "유효하지 않은 데이터."),
    FAILED_AUTH_EMAIL(FORBIDDEN, "이메일 인증에 실패했습니다."),
    ALREADY_FULL(FORBIDDEN, "최대 인원을 초과하였습니다."),

    /* 404 NOT_FOUND : Resource 를 찾을 수 없음 */
    USER_NOT_FOUND(NOT_FOUND, "해당 유저 정보를 찾을 수 없습니다"),
    REFRESH_TOKEN_NOT_FOUND(NOT_FOUND, "로그아웃 된 사용자입니다"),
    EMAIL_NOT_FOUND(NOT_FOUND, "해당 이메일을 찾을 수 없습니다"),
    DATA_NOT_FOUND(NOT_FOUND, "데이터를 찾을 수 없습니다."),
    PLACE_NOT_FOUND(NOT_FOUND, "해당 장소를 찾을 수 없습니다"),
    FEED_NOT_FOUND(NOT_FOUND, "해당 피드를 찾을 수 없습니다"),
    MOOD_NOT_FOUND(NOT_FOUND, "해당 분위기를 찾을 수 없습니다"),

    /* 409 CONFLICT : Resource 의 현재 상태와 충돌. 보통 중복된 데이터 존재 */
    DUPLICATE_RESOURCE(CONFLICT, "데이터가 이미 존재합니다"),

    ;

    private final HttpStatus httpStatus;
    private final String detail;
}