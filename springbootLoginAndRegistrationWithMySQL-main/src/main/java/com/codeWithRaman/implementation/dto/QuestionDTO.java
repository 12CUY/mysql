package com.codeWithRaman.implementation.dto;

import java.util.List;

public class QuestionDTO {
    private String question;
    private String description;
    private List<AnswerDTO> answers;

    // Getters y Setters
    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<AnswerDTO> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
}