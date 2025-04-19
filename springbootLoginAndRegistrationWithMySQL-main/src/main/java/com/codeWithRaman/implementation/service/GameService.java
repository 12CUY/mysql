package com.codeWithRaman.implementation.service;

import org.springframework.stereotype.Service;
import com.codeWithRaman.implementation.model.UserScore;
import com.codeWithRaman.implementation.repository.UserScoreRepository;

import java.util.List;

@Service
public class GameService {

    private final UserScoreRepository userScoreRepository;

    public GameService(UserScoreRepository userScoreRepository) {
        this.userScoreRepository = userScoreRepository;
    }

    public List<UserScore> getTopScores() {
        return userScoreRepository.findTop10ByOrderByScoreDesc();
    }

    // Otros métodos para manejar la lógica del juego
}