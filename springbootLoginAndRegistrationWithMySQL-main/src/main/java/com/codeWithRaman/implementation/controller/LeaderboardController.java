package com.codeWithRaman.implementation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.codeWithRaman.implementation.service.GameService;

@Controller
public class LeaderboardController {

    private final GameService gameService;

    public LeaderboardController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/leaderboard")
    public String leaderboard(Model model) {
        model.addAttribute("scores", gameService.getTopScores());
        return "rankings";
    }
}