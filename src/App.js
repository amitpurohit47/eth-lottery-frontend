import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [showbtn, setShowbtn] = useState(true);
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
  const [isManager, setIsManager] = useState(false);

  const fetchData = async () => {
    const mngr = await lottery.methods.manager().call();
    const plrs = await lottery.methods.getPlayers().call();
    const bal = await web3.eth.getBalance(lottery.options.address);
    const accounts = await web3.eth.requestAccounts();
    setManager(mngr);
    setPlayers(plrs);
    setBalance(bal);
    setIsManager(accounts[0] === mngr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowbtn(false);
    setMessage("We are entering you into the lottery. Kindly hold on!");
    try {
      const accounts = await web3.eth.requestAccounts();
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      setMessage("You have been entered");
      fetchData();
    } catch (error) {
      setShowbtn(true);
      setMessage("Oops! There appears to be some error!");
    }
  };

  const pickWinner = async (e) => {
    e.preventDefault();
    setMessage1("We are picking a winner! Kindly hold on!");
    try {
      const accounts = await web3.eth.requestAccounts();
      if (accounts[0] !== manager) throw new Error();
      await lottery.methods.pickWinner().send({
        from: manager,
      });
      setMessage1("Winner has been picked!");
      fetchData();
    } catch (error) {
      setMessage1("Oops! There appears to be some error!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="main">
      <div className="left">
        <h2 className="main-heading">Ethereum <span>Lottery</span></h2>
        <p>Lottery managed by <span>{manager}</span></p>
        <p>
          There are currently <span>{players.length}</span> players competing to win{" "}
          <span>{web3.utils.fromWei(balance, "ether")}</span> ether
        </p>
        <hr />
        <form onSubmit={handleSubmit}>
          <h4>Wanna try your luck?</h4>
          <div>
            <label>Amount of eth to enter </label>
            <input value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          {showbtn ? <button>Enter</button> : <p>{message}</p>}
        </form>
        {isManager && (
          <div className="pick-winner">
            <p>Ready to pick a winner?</p>
            {message1 === "" ? (
              <button onClick={pickWinner}>Pick Winner</button>
            ) : (
              <p>{message1}</p>
            )}
          </div>
        )}
      </div>
      <div className="right">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="svg8"
          viewBox="0 0 365.5 592"
        >
          <g id="layer5">
            <g id="g1627">
              <path
                id="path1599"
                className="st0"
                d="M0 322.4c64.4 34.2 131.6 70 183.5 97.7l182-97.7c-65.9 97.9-120.8 179.4-182 269.6C122.2 502 54.5 402.7 0 322.4zm7-27l176.7-94.3 174.4 93.6-174.3 94.4L7 295.4zm176.5-124.5L0 267.5 182.7 0l182.8 268.1-182-97.2z"
              />
              <path
                id="path1593"
                className="st1"
                d="M183.5 420.1l182-97.7c-65.9 97.9-182 269.6-182 269.6V420.1zm.2-219l174.4 93.6-174.3 94.4-.1-188zm-.2-30.2L182.7 0l182.8 268.1-182-97.2z"
              />
              <path
                id="path1603"
                className="st1"
                d="M7 295.4l176.7 14.5 174.4-15.1-174.3 94.4L7 295.4z"
              />
              <path
                id="path1606"
                className="st2"
                d="M183.7 309.9l174.4-15.1-174.3 94.4-.1-79.3z"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default App;
