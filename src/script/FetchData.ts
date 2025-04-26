import { Metaplex } from "@metaplex-foundation/js";
import { PublicKey } from "@solana/web3.js";

export async function fetchCollectionsByWallet(metaplex: Metaplex, walletPublicKey: PublicKey) {
  try {
    // Fetch all NFTs where your wallet is the "updateAuthority"
    const nfts = await metaplex.nfts().findAllByUpdateAuthority({ updateAuthority: walletPublicKey });

    // Filter to only collections (not regular NFTs)
    const collections = nfts.filter((nft) => nft.collectionDetails !== null);

    console.log("✅ Found collections:", collections);

    return collections; // Return the list
  } catch (error) {
    console.error("❌ Error fetching collections:", error);
    return [];
  }
}
