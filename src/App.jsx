

function App() {

  

  return (
    <div className="App">
      <div className="container">
        <h4>Euro 2024</h4>
        <button>Start game</button>
        <ul>
          <li className="game">
            <p>
              Poland vs Spain
              <span>
                0 : 0
              </span>
            </p>
          </li>
          <li className="game">
            <p>
              Germany vs France
              <span>
                0 : 0
              </span>
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

export default App;
