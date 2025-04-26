import { useWallet } from "@solana/wallet-adapter-react";
import createCollection from "../script/CreateCollection"; // your createCollection file
import { CreateCollectionParams } from "../script/CreateCollection";
import { useState } from "react";

export default function CreateCollectionButton() {
  const wallet = useWallet(); // real wallet context from your connected user
  const [loading, setLoading] = useState(false);

  const handleCreateCollection = async () => {
    if (!wallet.connected) {
      alert("Please connect your wallet first!");
      return;
    }

    const collectionParams: CreateCollectionParams = {
      name: "Coca Real Wallet",
      symbol: "COCA",
      metadataUri:
        "https://coffee-passive-spider-608.mypinata.cloud/ipfs/bafkreieufz64ltcshlhtfnxrddlfwckl4gna2lwvhkrd2plgxaocyzp7lm", // Your uploaded metadata
    };

    try {
      setLoading(true);

      const result = await createCollection(wallet, collectionParams);

      console.log(
        "✅ Collection created with address:",
        result.collectionAddress
      );
      alert(`Collection created!\nAddress: ${result.collectionAddress}`);
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
