import { useEffect } from "react";
import { Zora } from "@zoralabs/zdk";
import { Wallet, providers } from "ethers";
import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
} from "@zoralabs/zdk";

import logo from "./logo.svg";
import "./App.css";
import getWeb3 from "./getWeb3";

const metadataJSON = generateMetadata("zora-20210101", {
  description: "",
  mimeType: "text/plain",
  name: "",
  version: "zora-20210101",
});

function App() {
  useEffect(() => {
    try {
      (async () => {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        console.log("account: ", accounts);

        const provider = new providers.Web3Provider(window.ethereum);

        console.log(provider);

        const wallet = Wallet.createRandom();
        const zora = new Zora(provider, 4);

        console.log("zora", zora);

        const media = await zora.fetchTotalMedia();

        console.log("media: ", media);
      })();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  const minting = async () => {
    const provider = new providers.Web3Provider(window.ethereum);
    const zora = new Zora(provider, 4);

    const contentHash = sha256FromBuffer(Buffer.from("Ours Truly,"));
    const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));
    const mediaData = constructMediaData(
      "https://ipfs.io/ipfs/bafybeifyqibqlheu7ij7fwdex4y2pw2wo7eaw2z6lec5zhbxu3cvxul6h4",
      "https://ipfs.io/ipfs/bafybeifpxcq2hhbzuy2ich3duh7cjk4zk4czjl6ufbpmxep247ugwzsny4",
      contentHash,
      metadataHash
    );
    /**
     * Note: Before minting, verify that the content stored at the uris
     * can be hashed and matches the hashes in the `MediaData`.
     *
     * Soon, we will ship utility functions to handle this for you.
     */

    const bidShares = constructBidShares(
      10, // creator share
      90, // owner share
      0 // prevOwner share
    );
    const tx = await zora.mint(mediaData, bidShares);
    await tx.wait(8); // 8 confirmations to finalize
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={minting}>Mint cryptomedia</button>
      </header>
    </div>
  );
}

export default App;
