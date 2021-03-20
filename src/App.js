import { useEffect, useState } from "react";
import { Wallet, providers, BigNumber } from "ethers";
import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
  Zora,
  constructBid,
  Decimal,
  approveERC20,
} from "@zoralabs/zdk";

import logo from "./logo.svg";
import "./App.css";
import getWeb3 from "./getWeb3";
import { MaxUint256 } from "@ethersproject/constants";

const metadataJSON = generateMetadata("zora-20210101", {
  description: "",
  mimeType: "text/plain",
  name: "",
  version: "zora-20210101",
});

function App() {
  const [address, setAddress] = useState({});
  const [signer, setSigner] = useState({});
  const [wallet, setWallet] = useState({});
  const [zora, setZora] = useState({});

  useEffect(() => {
    try {
      (async () => {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        const provider = new providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        const myAddress = await signer.getAddress();

        const zora = new Zora(signer, 4);

        setAddress(myAddress);
        setSigner(signer);
        setZora(zora);
        console.log(zora);
      })();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  // const minting = async () => {
  //   const provider = new providers.Web3Provider(window.ethereum);
  //   const zora = new Zora(provider, 4);

  //   const contentHash = sha256FromBuffer(Buffer.from("Ours Truly,"));
  //   const metadataHash = sha256FromBuffer(Buffer.from(metadataJSON));
  //   const mediaData = constructMediaData(
  //     "https://ipfs.io/ipfs/bafybeifyqibqlheu7ij7fwdex4y2pw2wo7eaw2z6lec5zhbxu3cvxul6h4",
  //     "https://ipfs.io/ipfs/bafybeifpxcq2hhbzuy2ich3duh7cjk4zk4czjl6ufbpmxep247ugwzsny4",
  //     contentHash,
  //     metadataHash
  //   );
  //   /**
  //    * Note: Before minting, verify that the content stored at the uris
  //    * can be hashed and matches the hashes in the `MediaData`.
  //    *
  //    * Soon, we will ship utility functions to handle this for you.
  //    */

  //   const bidShares = constructBidShares(
  //     10, // creator share
  //     90, // owner share
  //     0 // prevOwner share
  //   );
  //   const tx = await zora.mint(mediaData, bidShares);
  //   await tx.wait(8); // 8 confirmations to finalize
  // };

  const bidding = async () => {
    const dai = "0x8ad3aa5d5ff084307d28c8f514d7a193b2bfe725";

    // grant approval
    await approveERC20(signer, dai, zora.marketAddress, MaxUint256);

    console.log(address);

    console.log(Decimal.new(100));

    const decimal100 = Decimal.new(100);

    const bid = constructBid(
      dai, // currency
      // Decimal.new(10).value, // amount 10*10^18
      decimal100.value, // amount 10*10^18
      address, // bidder address
      address, // recipient address (address to receive Media if bid is accepted)
      10 // sellOnShare
    );

    console.log("bid", bid);

    const tx = await zora.setBid(546, bid);
    await tx.wait(8); // 8 confirmations to finalize
    console.log(tx);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={bidding}>bid cryptomedia</button>
      </header>
    </div>
  );
}

export default App;
