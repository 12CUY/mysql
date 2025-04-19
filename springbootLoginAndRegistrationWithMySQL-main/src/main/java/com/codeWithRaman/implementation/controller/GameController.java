package com.codeWithRaman.implementation.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GameController {

    @GetMapping("/game")
    public String game() {
        return "game";
    }

    @GetMapping("/game/easy")
    public String easyGame() {
        return "game-easy";
    }

    @GetMapping("/game/medium")
    public String mediumGame() {
        return "game-medium";
    }

    @GetMapping("/game/hard")
    public String hardGame() {
        return "game-hard";
    }
}