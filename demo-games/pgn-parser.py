import chess.pgn

name = "anderssen_dufresne_1852"

pgn = open(name + ".pgn")
game = chess.pgn.read_game(pgn)
board = game.board()

uci_moves = []

for move in game.mainline_moves():
    # Convert the move to UCI format
    uci_move = move.uci()
    # Handle castling moves
    if (uci_move == "e1g1" or uci_move == "e8g8"):
        uci_move = uci_move + "cs"
    elif (uci_move == "e1c1" or uci_move == "e8c1"):
        uci_move = uci_move + "cl"
    print(board.san(move), "->", uci_move)
    uci_moves.append(uci_move)
    board.push(move)

# Close the PGN file
pgn.close()

#save the UCI moves to a file
with open(name + ".uci", "w") as uci_file:
    for index, uci_move in enumerate(uci_moves):
        uci_file.write(uci_move + ('\n' if index < len(uci_moves) - 1 else ''))