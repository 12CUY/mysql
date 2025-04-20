package com.codeWithRaman.implementation.config;

import com.codeWithRaman.implementation.model.Answer;
import com.codeWithRaman.implementation.model.Question;
import com.codeWithRaman.implementation.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(QuestionRepository questionRepository) {
        return args -> {
            // Solo crear datos si no existen
            if (questionRepository.count() == 0) {
                // Pregunta 1 - Fácil
                Question q1 = new Question();
                q1.setQuestion("¿Qué es la contabilidad?");
                q1.setLevel(Question.Level.easy);
                q1.setDescription("La contabilidad es una herramienta fundamental para gestionar recursos y tomar decisiones fundamentales.");
                
                Answer a1 = new Answer();
                a1.setAnswer("Un sistema de registro de transacciones financieras");
                a1.setCorrect(true);
                a1.setQuestion(q1);
                
                Answer a2 = new Answer();
                a2.setAnswer("Un método de cálculo de impuestos");
                a2.setCorrect(false);
                a2.setQuestion(q1);
                
                Answer a3 = new Answer();
                a3.setAnswer("Una forma de ahorrar dinero");
                a3.setCorrect(false);
                a3.setQuestion(q1);
                
                Answer a4 = new Answer();
                a4.setAnswer("Un tipo de inversión");
                a4.setCorrect(false);
                a4.setQuestion(q1);
                
                q1.setAnswers(Arrays.asList(a1, a2, a3, a4));
                questionRepository.save(q1);

                // Agregar más preguntas según sea necesario
            }
        };
    }
}