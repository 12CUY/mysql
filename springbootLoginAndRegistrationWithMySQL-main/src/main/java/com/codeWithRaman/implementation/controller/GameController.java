package com.codeWithRaman.implementation.controller;

import com.codeWithRaman.implementation.dto.AnswerDTO;
import com.codeWithRaman.implementation.dto.QuestionDTO;
import com.codeWithRaman.implementation.model.Question;
import com.codeWithRaman.implementation.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.stream.Collectors;

@Controller
public class GameController {

    @Autowired
    private QuestionRepository questionRepository;

    @GetMapping("/facil")
    public String showEasyLevel(Model model) {
        return "facil"; // Esto mostrará el template facil.html
    }

    @GetMapping("/api-facil")
    @ResponseBody
    public List<QuestionDTO> getEasyQuestions() {
        List<Question> questions = questionRepository.findByLevel(Question.Level.easy);
        return questions.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private QuestionDTO convertToDTO(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.setQuestion(question.getQuestion());
        dto.setDescription(question.getDescription());

        List<AnswerDTO> answerDTOs = question.getAnswers().stream()
                .map(answer -> {
                    AnswerDTO answerDTO = new AnswerDTO();
                    answerDTO.setAnswer(answer.getAnswer());
                    answerDTO.setCorrect(answer.isCorrect());
                    return answerDTO;
                })
                .collect(Collectors.toList());

        dto.setAnswers(answerDTOs);
        return dto;
    }
}