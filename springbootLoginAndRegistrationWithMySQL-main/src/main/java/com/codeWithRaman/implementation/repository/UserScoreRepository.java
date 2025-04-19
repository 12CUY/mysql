package com.codeWithRaman.implementation.repository;

import com.codeWithRaman.implementation.model.UserScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserScoreRepository extends JpaRepository<UserScore, Long> {

    @Query("SELECT us FROM UserScore us ORDER BY us.score DESC")
    List<UserScore> findTop10ByOrderByScoreDesc();
}