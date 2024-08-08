import { useEffect, useReducer } from "react";

const ACTIONS = {
  LOAD_DATA: "load data from outside server",
  START_GAME: "start game",
  SCORE_GOAL: "score random goal for one of the teams",
};

const initialState = {
  tournamentTitle: "",
  games: [],
  dataError: false,
  buttonText: "Start game",
  time: 9000,
  totalGoals: 0,
};

function gamesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        dataError: action.payload.status === "error" ? true : false,
        games: action.payload.data,
        tournamentTitle: action.payload.title,
      };
    case ACTIONS.START_GAME:
      return {
        ...state,
        buttonText: action.payload.buttonText,
      };
    case ACTIONS.SCORE_GOAL:
      return {
        ...state,
        games: action.payload.updatedGames,
        totalGoals: action.payload.totalGoals,
        time: action.payload.timeLeft,
      };
    default:
      throw new Error("error");
  }
}

function App() {
  const [
    { tournamentTitle, games, dataError, buttonText, time, totalGoals, action },
    dispatch,
  ] = useReducer(gamesReducer, initialState);

  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch("http://localhost:8000/data");
        if (!res.ok) throw new Error("Something went wrong with fetching data");
        const data = await res.json();

        dispatch({
          type: ACTIONS.LOAD_DATA,
          payload: { 
            status: "success", 
            data: data.games, 
            title: data.title 
          },
        });
      } catch (err) {
        dispatch({ type: ACTIONS.LOAD_DATA, payload: { status: "error" } });
      }
    }
    getData();
  }, []);

  function scoreGoal() {
    //select random game
    const gameId = Math.floor(Math.random() * games.length);
    const game = games[gameId];
    const chances = Math.random();
    let scorer = null;

    if (chances <= game.home.odds) {
      scorer = "home";
    } else {
      scorer = "away";
    }

    const singleGame = {
      id: game.id,
      home: {
        name: game.home.name,
        odds: game.home.odds,
        score: game.home.score + (scorer === "home" ? 1 : 0),
      },
      away: {
        name: game.away.name,
        odds: game.away.odds,
        score: game.away.score + (scorer === "away" ? 1 : 0),
      },
      active: game.active,
    };

    const newGames = [
      ...games.slice(0, gameId),
      singleGame,
      ...games.slice(gameId + 1),
    ];

    dispatch({
      type: ACTIONS.SCORE_GOAL,
      payload: {
        updatedGames: newGames,
        totalGoals: totalGoals + 1,
        timeLeft: time - 1000,
      },
    });
  }

  function handleGameStatus() {
    dispatch({
      type: ACTIONS.START_GAME,
      payload: {
        buttonText: "Finish",
      },
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h4>{tournamentTitle}</h4>
        <button onClick={scoreGoal}>test</button>
        <Button action={handleGameStatus} buttonText={buttonText} />
        <AllGames games={games} />
        <TotalGoals totalGoals={totalGoals} />
        <Timer time={time} />
      </div>
    </div>
  );
}

function TotalGoals({ totalGoals }) {
  return (
    <p className="total-goals">
      Total goals: <span>{totalGoals}</span>
    </p>
  );
}

function Timer({ time }) {
  return (
    <p className="total-goals">
      Time left:
      <span> {Number(time / 1000)}s</span>
    </p>
  );
}

function Button({ buttonText, action }) {
  return <button onClick={action}>{buttonText}</button>;
}

function AllGames({ games }) {
  return (
    <ul>
      {games.map((game) => (
        <SingleGame game={game} key={game.id} />
      ))}
    </ul>
  );
}

function SingleGame({ game }) {
  return (
    <li className="game">
      <p>
        {game.home.name} vs {game.away.name}
        <span>{game.home.score} : {game.away.score}</span>
      </p>
    </li>
  );
}

export default App;
