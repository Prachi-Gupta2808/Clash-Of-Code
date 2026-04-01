const runBatchForMode = () => {
const players = [
  { userId: "U12", socketId: "S12", rating: 1420 },
  { userId: "U3", socketId: "S3", rating: 1100 },
  { userId: "U19", socketId: "S19", rating: 1980 },
  { userId: "U7", socketId: "S7", rating: 1700 },
  { userId: "U1", socketId: "S1", rating: 900 },
  { userId: "U15", socketId: "S15", rating: 1550 },
  { userId: "U9", socketId: "S9", rating: 1250 },
  { userId: "U5", socketId: "S5", rating: 1350 },
  { userId: "U18", socketId: "S18", rating: 1900 },
  { userId: "U2", socketId: "S2", rating: 950 },
  { userId: "U14", socketId: "S14", rating: 1480 },
  { userId: "U6", socketId: "S6", rating: 1500 },
  { userId: "U10", socketId: "S10", rating: 1300 },
  { userId: "U4", socketId: "S4", rating: 1200 },
  { userId: "U17", socketId: "S17", rating: 1850 },
  { userId: "U8", socketId: "S8", rating: 1800 },
  { userId: "U13", socketId: "S13", rating: 1450 },
  { userId: "U11", socketId: "S11", rating: 1380 },
  { userId: "U16", socketId: "S16", rating: 1600 },
  { userId: "U20", socketId: "S20", rating: 2000 },
  { userId: "U21", socketId: "S21", rating: 2500 },
];

  // atleast two players required for pairing
  if (players?.length < 2) return;

  // freeze i.e. take a snapshot of the current lobby (in js playersays are passed by reference so to create a deep copy we used this method)

  players.sort((a, b) => a.rating - b.rating);

  let n = players?.length;
  let l = 0;
  let r = n - 1;

  while (l < r) {
    let player1 = players[l];
    let player2 = players[l + 1];
    l += 2;
    console.log(`🤝${player1.rating} vs ${player2.rating}`);

    if (r > l) {
      let player3 = players[r];
      let player4 = players[r - 1];
      r -= 2;

      console.log(`🤝${player3.rating} vs ${player4.rating}`);
    }
  }
};

runBatchForMode() ;
