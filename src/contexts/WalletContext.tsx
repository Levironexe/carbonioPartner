// import React, { createContext, ReactNode } from "react";
// // import {
// //   ConnectionProvider,
// //   WalletProvider,
// //   useWallet,
// // } from "@solana/wallet-adapter-react";
// // import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
// // import {
// //   PhantomWalletAdapter,
// //   SolflareWalletAdapter,
// //   TorusWalletAdapter,
// // } from "@solana/wallet-adapter-wallets";
// // import { clusterApiUrl } from "@solana/web3.js";
// // import { WalletContextState } from "@solana/wallet-adapter-react";
// // import "@solana/wallet-adapter-react-ui/styles.css";
// import { useWallet } from "@lazorkit/wallet";

// interface WalletContextType {
//   credentialId: any;
//   publicKey: any;
//   isConnected: any;
//   isLoading: any;
//   error: any;
//   smartWalletAuthorityPubkey: any;
//   connect: () => Promise<void>;
//   disconnect: () => void;
//   signMessage: (message: any) => Promise<any>;
//   handleConnect: () => Promise<void>;
//   handleDisconnect: () => void;
//   handleSignMessage: () => Promise<void>;
// }

// // Define the shape of your context
// export const WalletContext = createContext<WalletContextType | null>(null);

// // Define the props type
// interface WalletContextProviderProps {
//   children: ReactNode;
// }

// const WalletContextProvider: React.FC<WalletContextProviderProps> = ({
//   children,
// }) => {
//   // const endpoint = clusterApiUrl("devnet");

//   // const wallet: WalletContextState = useWallet();

//   // const wallets = useMemo(
//   //   () => [
//   //     new PhantomWalletAdapter(),
//   //     new SolflareWalletAdapter(),
//   //     new TorusWalletAdapter(),
//   //   ],
//   //   []
//   // );

//   const {
//     credentialId,
//     publicKey,
//     isConnected,
//     isLoading,
//     error,
//     smartWalletAuthorityPubkey,
//     connect,
//     disconnect,
//     signMessage,
//   } = useWallet();

//   const handleConnect = async () => {
//     try {
//       await connect();
//       console.log("Wallet connected:", smartWalletAuthorityPubkey);
//     } catch (err) {
//       console.error("Failed to connect wallet:", err);
//     }
//   };

//   const handleDisconnect = () => {
//     disconnect();
//     console.log("Wallet disconnected");
//   };

//   const handleSignMessage = async () => {
//     try {
//       const instruction = {}; // Replace with a valid TransactionInstruction
//       const txid = await signMessage(instruction);
//       console.log("Transaction ID:", txid);
//     } catch (err) {
//       console.error("Failed to sign message:", err);
//     }
//   };

//   const value: WalletContextType = {
//     credentialId,
//     publicKey,
//     isConnected,
//     isLoading,
//     error,
//     smartWalletAuthorityPubkey,
//     connect,
//     disconnect,
//     signMessage,
//     handleConnect,
//     handleDisconnect,
//     handleSignMessage,
//   };

//   return (
//     // <ConnectionProvider endpoint={endpoint}>
//     //   <WalletProvider wallets={wallets} autoConnect>
//     //     <WalletModalProvider>
//     <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
//     //     </WalletModalProvider>
//     //   </WalletProvider>
//     // </ConnectionProvider>
//   );
// };

// export default WalletContextProvider;
