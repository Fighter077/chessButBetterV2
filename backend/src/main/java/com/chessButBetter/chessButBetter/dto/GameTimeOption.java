package com.chessButBetter.chessButBetter.dto;

public class GameTimeOption {
    private Integer start;
    private Integer increment;

    public GameTimeOption() {
    }

    public GameTimeOption(Integer start, Integer increment) {
        this.start = start;
        this.increment = increment;
    }

    public Integer getStart() {
        return start;
    }

    public void setStart(Integer start) {
        this.start = start;
    }

    public Integer getIncrement() {
        return increment;
    }

    public void setIncrement(Integer increment) {
        this.increment = increment;
    }
}
