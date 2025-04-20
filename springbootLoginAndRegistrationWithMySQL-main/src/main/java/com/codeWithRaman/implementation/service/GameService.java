package com.codeWithRaman.implementation.service;

import com.codeWithRaman.implementation.model.Question;
import com.codeWithRaman.implementation.repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getQuestionsByLevel(Question.Level level) {
        return questionRepository.findByLevel(level);
    }
}