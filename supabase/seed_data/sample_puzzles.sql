-- Sample puzzle data for testing
INSERT INTO public.puzzles (
  fen,
  moves,
  difficulty,
  theme,
  description,
  source
) VALUES
-- Puzzle 1: Easy mate in 1
(
  'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
  'Qxf7#',
  1,
  'mate in 1',
  'Find the checkmate in one move',
  'Scholar''s Mate pattern'
),

-- Puzzle 2: Easy fork
(
  'rnbqkbnr/ppp2ppp/8/3pp3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
  'Nxe5',
  1,
  'fork',
  'Find the knight fork',
  'Common opening trap'
),

-- Puzzle 3: Medium pin
(
  '2r3k1/pp2ppbp/3p1np1/q1pP4/2P1P3/2N3P1/PP2QPBP/R4RK1 w - - 0 1',
  'Bf3',
  2,
  'pin',
  'Find the pin that wins material',
  'Middlegame tactic'
),

-- Puzzle 4: Medium discovered attack
(
  'r1bqk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
  'Nxe5',
  2,
  'discovered attack',
  'Find the discovered attack',
  'Italian Game variation'
),

-- Puzzle 5: Hard combination
(
  'r1b2rk1/pp1nbppp/2p1pn2/q7/3P4/1BN1PN2/PP3PPP/R2QK2R w KQ - 0 1',
  'Bxf7+ Rxf7 Ne5',
  3,
  'combination',
  'Find the tactical combination',
  'Classical opening variation'
),

-- Puzzle 6: Hard sacrifice
(
  'r2qkb1r/pp2nppp/3p4/2pP4/2n1P3/2N2N2/PPP2PPP/R1BQK2R w KQkq - 0 1',
  'Ne5 dxe5 d6',
  3,
  'sacrifice',
  'Find the piece sacrifice leading to an advantage',
  'Sicilian Defense variation'
),

-- Puzzle 7: Very hard mate sequence
(
  'r1b1kb1r/ppp2ppp/8/1B1qN3/3n4/8/PPPP1PPP/RNBQK2R w KQkq - 0 1',
  'Qxd4 Qxd4 Nf7+ Ke7 Nd5#',
  4,
  'mate in 3',
  'Find the forced mate in 3 moves',
  'Classical mating pattern'
),

-- Puzzle 8: Expert level zugzwang
(
  '8/8/p1pN4/1p6/1P2k3/P7/3K4/8 w - - 0 1',
  'Nb7 Kd4 Na5 Kc5 Kc3',
  5,
  'zugzwang',
  'Find the winning endgame sequence with zugzwang',
  'Famous endgame study by Grigoriev'
); 