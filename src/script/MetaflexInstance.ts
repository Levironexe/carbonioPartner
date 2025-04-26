
import { Metaplex } from "@metaplex-foundation/js";
import {
  Connection, // Establishes connection to Solana network
  clusterApiUrl,
} from "@solana/web3.js";

import { WalletContextState} from '@solana/wallet-adapter-react';
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";

const connection = new Connection(clusterApiUrl("devnet"));

export const createMetaplexInstance = (wallet: WalletContextState) => {
  
};
