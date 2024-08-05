import { useEffect, useReducer } from "react";

const ACTIONS = {
  LOAD_DATA: "load data from outside server",
};

const initialState = {
  games: [],
  dataError: false,
};

function gamesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.LOAD_DATA:
      return {
        ...state,
        dataError: action.payload.status === "error" ? true : false,
        games: action.payload.data,
      };
    default:
      throw new Error("error");
  }
}

function App() {
  const [{ games, dataError }, dispatch] = useReducer(
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
          payload: { status: "success", data: data.games },
        });
        // dispatch({
        //   type: ACTIONS.LOADING_DATA,
        //   payload: { status: "success", data: data.games },
        // });
        // setGames(() => data.games);
        // setTitle(() => data.title);
      } catch (err) {
        dispatch({ type: ACTIONS.LOADING_DATA, payload: { status: "error" } });
      }
    }
    getData();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h4>Euro 2024</h4>
        <button>Start game</button>
        <ul>
          <li className="game">
            <p>
              Poland vs Spain
              <span>0 : 0</span>
            </p>
          </li>
          <li className="game">
            <p>
              Germany vs France
              <span>0 : 0</span>
            </p>
          </li>
        </ul>
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

function AllGames({games}){
  return (
    <ul>
      <li>Game</li>
    </ul>
  )
}

function SingleGame({game}) {
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
