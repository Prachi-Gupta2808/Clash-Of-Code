const { lobbies, leaveLobby } = require("./lobby");
const { v4 } = require('uuid') ;

const runBatchForMode = (mode, io) => {
  const lobby = lobbies[mode];

  // atleast two players required for pairing
  if (lobby?.length < 2) return;

  console.log(`Running Batch for [${mode}]`);
  // freeze i.e. take a snapshot of the current lobby (in js playersays are passed by reference so to create a deep copy we used this method)
  const players = structuredClone(lobby);

  players.sort((a, b) => a.rating - b.rating); // if -ve i.e. (a < b) -> a appears before b else swap | sort in increasing order

  let n = players?.length;
  let l = 0;
  let r = n - 1;

  while (l < r) {
    let player1 = players[l];
    let player2 = players[l + 1];
    l += 2;
    let roomId1 = v4() ;

    leaveLobby(player1.userId, mode);
    leaveLobby(player2.userId, mode);
    
    
    // notify both the players
    io.to(player1.socketId).emit("PAIRED", {
        opponent: player2.userId,
        roomId: roomId1, 
        mode,
    });
    
    io.to(player2.socketId).emit("PAIRED", {
        opponent: player1.userId,
        roomId: roomId1,
        mode,
    });
    console.log(`🤝[${mode}] ${player1.userId} vs ${player2.userId}`);
    
    if (r > l) {
        let player3 = players[r];
        let player4 = players[r - 1];
        r -= 2;
        let roomId2 = v4() ;
        
        io.to(player3.socketId).emit("PAIRED", {
            opponent: player4.userId,
            roomId: roomId2,
            mode,
        });
        
        io.to(player4.socketId).emit("PAIRED", {
            opponent: player3.userId,
            roomId: roomId2,
            mode,
        });
        
      leaveLobby(player3.userId, mode);
      leaveLobby(player4.userId, mode);

      console.log(`🤝[${mode}] ${player3.userId} vs ${player4.userId}`);
    }
  }
};

module.exports = { runBatchForMode };
