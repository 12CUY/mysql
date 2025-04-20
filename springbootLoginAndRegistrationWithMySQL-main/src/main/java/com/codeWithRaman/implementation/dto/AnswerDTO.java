package com.codeWithRaman.implementation.dto;

public class AnswerDTO {
    private String answer;
    private boolean isCorrect;

    // Getters y Setters
    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean correct) {
        isCorrect = correct;
    }
}