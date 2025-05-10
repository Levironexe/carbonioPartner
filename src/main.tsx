import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Upload from "./pages/Upload.tsx";
import Statistic from "./pages/Statistic.tsx";
import History from "./pages/History.tsx";
import Profile from "./pages/Profile.tsx";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Set up wallet adapters
const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];

// Solana endpoint (devnet for development)
const endpoint = clusterApiUrl("devnet");

// React Router setup
const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Upload />,
      },
      {
        path: "statistic",
        element: <Statistic />,
      },
      {
        path: "history",
        element: <History />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <RouterProvider router={routers} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>
);
