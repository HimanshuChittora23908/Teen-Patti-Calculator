import { useState, useEffect } from "react";
import "./App.css";
import PopUp from "./PopUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCoins,
  faEye,
  faEyeSlash,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

function App() {
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [numberOfPlayers, setNumberOfPlayers] = useState(0);
  const [winningAmount, setWinningAmount] = useState(0);
  const [purse, setPurse] = useState(0);
  const [bootAmount, setBootAmount] = useState(0);
  const [currentBet, setCurrentBet] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const startGame = () => {
    if (numberOfPlayers === 0) {
      alert("Please enter number of players");
      return;
    }
    if (bootAmount === 0) {
      alert("Please enter boot amount");
      return;
    }
    if (purse === 0) {
      alert("Please enter purse amount");
      return;
    }
    if (players.length === 0) {
      alert("Please enter players");
      return;
    }
    if (numberOfPlayers < 2) {
      alert("Minimum 2 players required to start the game");
      return;
    }
    if (bootAmount < 1) {
      alert("Boot amount should be greater than 0");
      return;
    }
    if (purse < 10) {
      alert("Purse amount should be greater than 10");
      return;
    }
    if (players.length !== Number(numberOfPlayers)) {
      alert("Number of players and players entered should be same");
      return;
    }

    const temp_players = players.map((player) => {
      return {
        name: player,
        curr_amount: Number(purse) - Number(bootAmount),
        isPlaying: true,
        isBlind: true,
      };
    });

    setPlayers(temp_players);
    setCurrentBet(bootAmount * 2);
    setWinningAmount(bootAmount * numberOfPlayers);
    setIsGameStarted(true);
  };

  useEffect(() => {
    if (players.filter((player) => player.isPlaying).length === 1) {
      const winner = players.find((player) => player.isPlaying);
      alert(
        `Game Over! ${
          players.find((player) => player.isPlaying).name
        } won this round`
      );

      setPlayers(
        players.map((player) => {
          return {
            ...player,
            isPlaying: true,
            curr_amount:
              winner === player
                ? player.curr_amount + winningAmount - bootAmount
                : player.curr_amount - bootAmount,
            isBlind: true,
          };
        })
      );

      setCurrentPlayer(0);
      setWinningAmount(bootAmount * numberOfPlayers);
      setCurrentBet(bootAmount * 2);
    }
  }, [players]);

  const chaal = () => {
    if (
      players[currentPlayer].curr_amount <
      (players[currentPlayer].isBlind ? currentBet / 2 : currentBet)
    ) {
      alert("You don't have enough amount to chaal, please pack");
      return;
    }
    const temp_players = [...players];
    temp_players[currentPlayer].curr_amount -= temp_players[currentPlayer]
      .isBlind
      ? currentBet / 2
      : currentBet;
    setWinningAmount(
      winningAmount +
        (temp_players[currentPlayer].isBlind ? currentBet / 2 : currentBet)
    );
    setPlayers(temp_players);
    let nextPlayer = (currentPlayer + 1) % players.length;
    while (!players[nextPlayer].isPlaying) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }
    setCurrentPlayer(nextPlayer);
  };

  const raise = () => {
    if (
      players[currentPlayer].curr_amount <
      (players[currentPlayer].isBlind ? currentBet : currentBet * 2)
    ) {
      alert(
        "You don't have enough amount to raise, please select Chaal or Pack"
      );
      return;
    }
    const temp_players = [...players];
    temp_players[currentPlayer].curr_amount -= currentBet * 2;
    setWinningAmount(winningAmount + currentBet * 2);
    setCurrentBet(currentBet * 2);
    setPlayers(temp_players);
    let nextPlayer = (currentPlayer + 1) % players.length;
    while (!players[nextPlayer].isPlaying) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }
    setCurrentPlayer(nextPlayer);
  };

  const slideShow = (playerLost) => {
    if (
      players[currentPlayer].curr_amount <
      (players[currentPlayer].isBlind ? currentBet : currentBet * 2)
    ) {
      alert(
        "You don't have enough amount to slide show, please select Chaal or Pack"
      );
      return;
    }
    const temp_players = [...players];
    temp_players[currentPlayer].curr_amount -= temp_players[currentPlayer]
      .isBlind
      ? currentBet
      : currentBet * 2;
    temp_players[playerLost].isPlaying = false;
    setPlayers(temp_players);
    setWinningAmount(
      winningAmount +
        (temp_players[currentPlayer].isBlind ? currentBet : currentBet * 2)
    );
    let nextPlayer = (currentPlayer + 1) % players.length;
    while (!players[nextPlayer].isPlaying) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }
    setCurrentPlayer(nextPlayer);
  };

  const pack = () => {
    const temp_players = [...players];
    temp_players[currentPlayer].isPlaying = false;
    setPlayers(temp_players);
    let nextPlayer = (currentPlayer + 1) % players.length;
    while (!players[nextPlayer].isPlaying) {
      nextPlayer = (nextPlayer + 1) % players.length;
    }
    setCurrentPlayer(nextPlayer);
  };

  const actionHandler = (action) => {
    switch (action) {
      case "Chaal":
        chaal();
        break;
      case "Raise":
        raise();
        break;
      case "Slide Show":
        openModal();
        break;
      case "Pack":
        pack();
        break;
      default:
        console.log("Unknown action: ", action);
        break;
    }
  };

  const getBetAmount = (action, player, currentBet) => {
    switch (action) {
      case "Raise":
        return player.isBlind ? currentBet : currentBet * 2;
      case "Chaal":
        return player.isBlind ? currentBet / 2 : currentBet;
      case "Slide Show":
        return player.isBlind ? currentBet : currentBet * 2;
      default:
        return "0";
    }
  };

  return (
    <div className="w-full h-screen">
      {isGameStarted ? (
        <div className="p-4">
          <div className="flex justify-between items-center">
            <div className="w-1/3"></div>
            <h1 className="text-4xl text-center font-bold w-1/3">Teen Patti</h1>
            <div className="flex gap-8 w-1/3 justify-end">
              <div className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faCoins} />
                <h5>{winningAmount}</h5>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faBolt} />
                <h5>{bootAmount}</h5>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <FontAwesomeIcon icon={faWallet} />
                <h5>{purse}</h5>
              </div>
            </div>
          </div>

          <div className="flex justify-center w-full my-8">
            <div className="rounded-lg py-4 px-8 bg-purple-600 flex flex-col items-center gap-8 w-1/2">
              <div className="flex justify-between w-full items-center">
                <h5 className="text-white text-3xl font-bold">
                  {players[currentPlayer].name}
                </h5>
                <div className="text-xl text-white flex gap-2 items-center">
                  <FontAwesomeIcon icon={faWallet} />
                  {players[currentPlayer].curr_amount}
                </div>
              </div>
              <div className="flex w-full justify-between">
                {["Chaal", "Raise", "Slide Show", "Pack"].map(
                  (action, index) => (
                    <button
                      className="rounded px-8 py-2 bg-purple-800 text-white hover:bg-purple-900 hover:shadow-sm focus:outline-none flex transition duration-200"
                      key={index}
                      onClick={() => actionHandler(action)}
                    >
                      {action} (
                      {getBetAmount(action, players[currentPlayer], currentBet)}
                      )
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          <div class="fixed bottom-0 right-0 px-8 text-white text-center w-full flex justify-between gap-8 my-4">
            {players?.map((player, index) => (
              <div className="flex justify-center w-full" key={index}>
                <div
                  className={`rounded-lg py-4 px-8 
                  ${player.isPlaying ? "bg-blue-600" : "bg-gray-700"}
                   flex flex-col items-center w-full`}
                >
                  <div className="flex justify-between w-full items-center">
                    <h5 className="text-white text-3xl font-bold">
                      {player.name}
                    </h5>
                    <div className="text-white flex gap-4 items-center text-lg">
                      <div
                        className="flex gap-2 items-center"
                        onClick={() =>
                          setPlayers(
                            players.map((p, i) =>
                              i === index ? { ...p, isBlind: !p.isBlind } : p
                            )
                          )
                        }
                      >
                        <FontAwesomeIcon
                          icon={player.isBlind ? faEyeSlash : faEye}
                        />
                        {player.isBlind ? "Blind" : "Seen"}
                      </div>
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faWallet} />
                        {player.curr_amount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <PopUp
            isOpen={isOpen}
            closeModal={closeModal}
            players={players}
            currentPlayer={currentPlayer}
            numberOfPlayers={numberOfPlayers}
            slideShow={slideShow}
          />
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center">
          <div className="w-3/4 border-2 px-8 py-4 rounded-lg shadow-md border-slate-100">
            <h3 className="text-2xl font-bold mb-4 text-center text-[#444]">
              Teen Patti - New Game
            </h3>
            <form className="">
              <div className="mb-6">
                <label className="block text-gray-500 font-bold mb-1 pr-4">
                  Number of Players
                </label>
                <input
                  className="bg-gray-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
                  type="number"
                  onChange={(e) => setNumberOfPlayers(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 font-bold mb-1 pr-4">
                  Boot Amount
                </label>
                <input
                  className="bg-gray-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="number"
                  onChange={(e) => setBootAmount(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 font-bold mb-1 pr-4">
                  Purse Amount
                </label>
                <input
                  className="bg-gray-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="number"
                  onChange={(e) => setPurse(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 font-bold mb-1 pr-4">
                  Players (Player 1, Player 2, Player 3, ...)
                </label>
                <input
                  className="bg-gray-100 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  type="text"
                  onChange={(e) =>
                    setPlayers(
                      e.target.value.split(",").map((player) => player.trim())
                    )
                  }
                />
              </div>
              <div className="flex justify-center">
                <button
                  className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
                  type="button"
                  onClick={() => startGame()}
                >
                  Start Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
