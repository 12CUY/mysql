package com.codeWithRaman.implementation.repository;

import com.codeWithRaman.implementation.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLevel(Question.Level level);
}