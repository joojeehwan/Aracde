package com.ssafy.arcade.common.util;

public enum CommonCode {
    G01("이어그리기", true),
    G02("범인을 잡아라", true),
    G03("몸으로 말해요", true);

    private String name;
    private boolean useYn;

    private CommonCode(String name, boolean useYn) {
        this.name = name;
        this.useYn = useYn;
    }
    public String getName() {
        return this.name;
    }
    public boolean isUserYn() {
        return this.useYn;
    }
}
