import { useEffect } from "react";
import { Zora } from "@zoralabs/zdk";
import { Wallet } from "ethers";

import logo from "./logo.svg";
import "./App.css";
import getWeb3 from "./getWeb3";

function App() {
  useEffect(() => {
    try {
      (async () => {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        console.log("account: ", accounts);
      })();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
