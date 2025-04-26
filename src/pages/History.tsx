import { useWallet } from "@solana/wallet-adapter-react";
import createCollection from "../script/CreateCollection"; // your createCollection file
import { CreateCollectionParams } from "../script/CreateCollection";
import createNFT from "../script/CreateNFT"; // your createCollection file
import { CreateNFTParams } from "../script/CreateNFT";
import { useState } from "react";
import {fetchCollectionsByWallet} from "../script/FetchData"


export default function CreateCollectionButton() {
  const wallet = useWallet(); // real wallet context from your connected user
  const [loading, setLoading] = useState(false);

  const handleCreateCollection = async () => {
    if (!wallet.connected) {
      alert("Please connect your wallet first!");
      return;
    }

    const collectionParams: CreateCollectionParams = {
      name: "Coca",
      symbol: "COCA",
      metadataUri:
        "https://coffee-passive-spider-608.mypinata.cloud/ipfs/bafkreieufz64ltcshlhtfnxrddlfwckl4gna2lwvhkrd2plgxaocyzp7lm", 
      // Your uploaded metadata
    };

  

    try {
      setLoading(true);

      fetchCollectionsByWallet()

      // const result = await createCollection(wallet, collectionParams);

      // console.log(
      //   "✅ Collection created with address:",
      //   result.collectionAddress
      // );


      // const NFTParams: CreateNFTParams = {
      //   name: "Material Sourcing", 
      //   symbol: "MS",
      //   metadataUri: "https://coffee-passive-spider-608.mypinata.cloud/ipfs/bafkreibmcjxakzp6f7bupfrifsri5tnxmxt53tis2opdmeert3cqic2an4",
      //   collectionMint: result.collectionAddress

      // }

      // const nftResult = await createNFT(wallet, NFTParams);

      // console.log("✅ NFT created with address:", nftResult.NFTAddress);
      // console.log("NFT Metadata:", nftResult);
  

      //alert(`Collection created!\nAddress: ${result.collectionAddress}`);

      // result.attributes.forEach((attr: { trait_type: any; value: any }) => {
      //   console.log(`${attr.trait_type}: ${attr.value}`);
      // });

      // console.log(result.imageUri)



    } catch (error) {
      console.error("❌ Error creating collection:", error);
      alert("Failed to create collection, check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateCollection}
      disabled={loading}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        backgroundColor: "red",
        color: "white",
      }}
    >
      {loading ? "Creating..." : "Create Collection"}
    </button>
  );
}