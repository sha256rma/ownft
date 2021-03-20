import { useEffect, useState } from "react";
import { Zora } from "@zoralabs/zdk";
import { Wallet, providers } from "ethers";
import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
} from "@zoralabs/zdk";

import {
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
} from "@material-ui/core";
import "./App.css";
import getWeb3 from "./getWeb3";

import { getAddressCollection } from "./api/media";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const metadataJSON = generateMetadata("zora-20210101", {
  description: "",
  mimeType: "text/plain",
  name: "",
  version: "zora-20210101",
});

function App() {
  const [tab, setTab] = useState(1);

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

        const zora = new Zora(provider, 4);

        console.log("zora", zora);
      })();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const renderScreen = () => {
    if (tab === 0) {
      return renderMarketplace();
    } else if (tab === 1) {
      return renderCollection();
    }
  };

  const renderMarketplace = () => {
    return (
      <GridList
        cellHeight={300}
        style={{ height: "100%", width: "100%" }}
        cols={5}
      >
        {marketplaceData.map((nft) => (
          <GridListTile
            style={{
              height: 300,
              width: "19%",
              margin: ".5%",
              border: "0.5px solid white",
              borderRadius: 10,
              padding: 10,
            }}
            key={nft.img}
            cols={1}
          >
            <img
              style={{ height: 180, width: "100%", borderRadius: 10 }}
              src={nft.image}
              alt={nft.name}
            />
            <Button variant="outlined" color="primary">
              Purchase
            </Button>
            <GridListTileBar
              style={{ height: 40 }}
              title={nft.name}
              subtitle={`${nft.cost} ETH`}
            />
          </GridListTile>
        ))}
      </GridList>
    );
  };

  const renderCollection = () => {
    return (
      <GridList
        cellHeight={300}
        style={{ height: "100%", width: "100%", flex: 1 }}
        cols={5}
      >
        {marketplaceData.map((nft) => (
          <div
            style={{
              height: 220,
              width: "17%",
              margin: ".5%",
              border: ".2px solid white",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <GridListTile key={nft.img} cols={1}>
              <img
                style={{ height: 180, width: "100%", borderRadius: 10 }}
                src={nft.image}
                alt={nft.name}
              />
              <GridListTileBar title={nft.name} />
            </GridListTile>
            <Button
              style={{ height: 40, width: "100%" }}
              variant="outlined"
              color="secondary"
            >
              Sell
            </Button>
          </div>
        ))}
      </GridList>
    );
  };

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

  const getCollection = () => {
    getAddressCollection("0x4153614ec1836e8916020aee69d67a9e1e495dbf").then(
      (res) => {
        console.log("res: ", res);
      }
    );
  };

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <button onClick={minting}>Mint cryptomedia</button>
    //     <button onClick={getCollection}>Get Collection</button>
    //   </header>
    <div className="App" style={{ flex: 1, backgroundColor: "black" }}>
      <AppBar
        style={{ background: "black", marginBottom: 20 }}
        position="static"
      >
        <Tabs
          value={tab}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="Marketplace" {...a11yProps(0)} />
          <Tab label="My Collection" {...a11yProps(1)} />
          <Tab label="Create NFT" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      {renderScreen()}
    </div>
  );
}

export default App;

const collectionData = [];

const marketplaceData = [
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://deepart-io.s3.amazonaws.com/cache/60/9b/609babec66cdce0c1a6fefc69db84099.jpg",
    name: "Faceless Puzzle",
    cost: 0.56,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://i.pinimg.com/736x/85/dd/bc/85ddbc7ee50d1a0aaef6dde432edd58a.jpg",
    name: "Mother Nature",
    cost: 2.1,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image: "https://nwn.blogs.com/.a/6a00d8341bf74053ef022ad3bc5b52200d-600wi",
    name: "Deep Trip",
    cost: 100.56,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://pbs.twimg.com/profile_images/665598894626070528/7nxQxc6s_400x400.png",
    name: "Wave Runner",
    cost: 20.3,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image: "https://i.ytimg.com/vi/olj6rktnr40/maxresdefault.jpg",
    name: "E=mc^2",
    cost: 0.23,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://c4.wallpaperflare.com/wallpaper/829/227/702/cat-artwork-eyes-deep-art-wallpaper-preview.jpg",
    name: "Hopeless Cat",
    cost: 0.59,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://render.fineartamerica.com/images/rendered/search/print/5.5/8/break/images/artworkimages/medium/1/imagination-soosh.jpg",
    name: "Unemployed Santa",
    cost: 5.99,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://res.cloudinary.com/cook-becker/image/fetch/q_auto:best,f_auto,w_1920,e_sharpen/https://candb.com/site/candb/images/artwork/cathedral-of-the-deep-dark-souls-3-from-software.jpg",
    name: "Cracks in the wall",
    cost: 7.22,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://lh3.googleusercontent.com/proxy/dOBcmmJSne8Y3usggR9VfPObb5HpeGkzVX8VD9dg9xP9qMgmvvANWAxDiTd7W2O7Qbla-ThfuT_thEm8sIuV1xRBFCPjyiwjWzjxvz9M-sLe-ringQHPXldkCEI3qxkORB00c22MRU_Lfv3Zi3i0paro6bG-SOCL9vg9",
    name: "Siren's Lust",
    cost: 512.34,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://i.etsystatic.com/9170597/r/il/d3ccd3/564403805/il_570xN.564403805_771l.jpg",
    name: "Predator",
    cost: 1.23,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://artist.com/photos/arts/big/deep-conversation-1494857212.jpg",
    name: "Beneath it all",
    cost: 3.21,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://i.pinimg.com/originals/d2/fc/c7/d2fcc7580f641b5fdf2a854b937f1902.jpg",
    name: "Back in my day",
    cost: 4.56,
  },
];
