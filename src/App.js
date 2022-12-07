import web3 from "./web3";
import lottery from "./lottery";
import "./App.css";
import { useEffect, useState } from "react";

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
    const accounts = await web3.eth.getAccounts();
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
      const accounts = await web3.eth.getAccounts();
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
      const accounts = await web3.eth.getAccounts();
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
      <h2>ETHEREUM LOTTERY</h2>
      <p>Lottery managed by {manager}</p>
      <p>
        There are currently {players.length} players competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether
      </p>
      <hr />
      <form onSubmit={handleSubmit}>
        <h4>Wanna try your luck?</h4>
        <div>
          <label>Amount of eth to enter </label>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </div>
        {showbtn ? <button>Enter</button> : { message }}
      </form>
      {isManager && (
        <div>
          <p>Ready to pick a winner?</p>
          {message1 === "" ? (
            <button onClick={pickWinner}>Pick Winner</button>
          ) : (
            message1
          )}
        </div>
      )}
    </div>
  );
}

export default App;
