package com.chessButBetter.chessButBetter.repositories;

import java.util.List;
import com.chessButBetter.chessButBetter.entity.Move;

public interface MoveRepository {

    List<Move> findByGameId(String gameId);
}
