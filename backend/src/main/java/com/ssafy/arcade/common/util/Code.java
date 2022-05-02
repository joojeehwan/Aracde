package com.ssafy.arcade.common.util;


public enum Code {
    // 게임 코드
    G01("이어 그리기", true),
    G02("범인을 찾아라", true),
    G03("몸으로 말해요", true);

    private String name;
    private boolean useYn;

    private Code(String name, boolean useYn) {
        this.name = name;
        this.useYn = useYn;
    }

    public String getName() {
        return this.name;
    }
    public boolean isUseYn() {
        return this.useYn;
    }

}
