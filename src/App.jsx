import { useEffect, useReducer } from "react";

const ACTIONS = {
  LOAD_DATA: "load data from outside server",
  START_GAME: "start game",
  STOP_GAME: "stop ongoing game before time runs out",
  RESTART_GAME: "restart game after timer runs out",
  SCORE_GOAL: "score random goal for one of the teams",
};

const initialState = {
  tournamentTitle: "",
  games: [],
  dataError: false,
  buttonText: "Start game",
  time: 9000,
  totalGoals: 0,
  status: "before",
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
        buttonText: "Finish",
        status: "ongoing",
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
    {
      tournamentTitle,
      games,
      dataError,
      buttonText,
      time,
      totalGoals,
      action,
      status,
    },
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
            title: data.title,
          },
        });
      } catch (err) {
        dispatch({ type: ACTIONS.LOAD_DATA, payload: { status: "error" } });
      }
    }
    getData();
  }, []);

  useEffect(
    function () {
      let intervalID;
      if (status === "ongoing") {
        intervalID = setInterval(() => {
          scoreGoal();
        }, 1000);
      }
      return function () {
        clearInterval(intervalID);
      };
    },
    [scoreGoal]
  );

  function changeGameStatus() {
    if (status === "before") {
      dispatch({
        type: ACTIONS.START_GAME,
      });
    } else if (status === "ongoing") {
      dispatch({
        type: ACTIONS.STOP_GAME,
      });
    } else if (status === "finished") {
      dispatch({
        type: ACTIONS.RESTART_GAME,
      });
    }
  }

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

    const updatedList = games.map((game) => {
      if (Number(game.id) === gameId + 1) {
        return {
          ...game,
          home: {
            ...game.home,
            score: game.home.score + (scorer === "home" ? 1 : 0),
          },
          away: {
            ...game.away,
            score: game.away.score + (scorer === "away" ? 1 : 0),
          },
          active: true,
        };
      } else {
        return {
          ...game,
          active: false,
        };
      }
    });

    dispatch({
      type: ACTIONS.SCORE_GOAL,
      payload: {
        updatedGames: updatedList,
        totalGoals: totalGoals + 1,
        timeLeft: time - 1000,
      },
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h4>{tournamentTitle}</h4>
        <button onClick={scoreGoal}>test</button>
        <Button action={changeGameStatus} buttonText={buttonText} />
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
        <span>
          {game.home.score} : {game.away.score}
        </span>
      </p>
    </li>
  );
}

export default App;
