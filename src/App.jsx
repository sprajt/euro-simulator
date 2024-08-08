import { useEffect, useReducer } from "react";

const ACTIONS = {
  LOAD_DATA: "load data from outside server",
};

const initialState = {
  tournamentTitle: "",
  games: [],
  dataError: false,
  buttonText: 'Start game'
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
    default:
      throw new Error("error");
  }
}

function App() {
  const [{ tournamentTitle, games, dataError, buttonText }, dispatch] = useReducer(
    gamesReducer,
    initialState
  );

  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch("http://localhost:8000/data");
        if (!res.ok) throw new Error("Something went wrong with fetching data");
        const data = await res.json();

        dispatch({
          type: ACTIONS.LOAD_DATA,
          payload: { status: "success", data: data.games, title: data.title },
        });
      } catch (err) {
        dispatch({ type: ACTIONS.LOADING_DATA, payload: { status: "error" } });
      }
    }
    getData();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h4>{tournamentTitle}</h4>
        <Button buttonText={buttonText} />

        <AllGames games={games} />

        <p className="total-goals">
          Total goals: <span>0</span>
        </p>
        <p className="total-goals">
          Time left:
          <span> 10:00</span>
        </p>
      </div>
    </div>
  );
}

function Button({buttonText}){
  return(
    <button>{buttonText}</button>
  )
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
        <span>0 : 0</span>
      </p>
    </li>
  );
}

export default App;
