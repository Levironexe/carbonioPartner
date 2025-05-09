import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "@solana/wallet-adapter-react-ui/styles.css";
import { useWallet } from "@lazorkit/wallet";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  useConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react";

const NavBar = () => {
  // Lazorkit authentication
  const {
    isConnected: isAuthenticated,
    isLoading: isAuthLoading,
    publicKey: authPublicKey,
    connect: authenticate,
    disconnect: deauthenticate,
    signMessage,
    smartWalletAuthorityPubkey,
    error: authError,
  } = useWallet();

  // Solana wallet connection
  const {
    publicKey: walletPublicKey,
    connected: isWalletConnected,
    disconnect: disconnectWallet,
    wallet,
  } = useSolanaWallet();

  const { setVisible } = useWalletModal();
  const { connection } = useConnection();

  const [walletStatus, setWalletStatus] = useState({
    connecting: false,
    error: null,
  });

  // Format wallet address to be more user-friendly
  const formatPublicKey = (key) => {
    if (!key) return "";
    const keyString = typeof key === "object" ? key.toString() : key;
    return `${keyString.slice(0, 4)}...${keyString.slice(-4)}`;
  };

  // Step 1: Handle biometric authentication
  const handleAuthenticate = async () => {
    try {
      setWalletStatus({
        connecting: true,
        error: null,
      });

      // Trigger Lazorkit biometric authentication
      await authenticate();

      console.log("Authentication successful with Lazorkit");

      // After successful authentication, proceed to wallet connection
      handleConnectWallet();
    } catch (err) {
      setWalletStatus({
        connecting: false,
        error: err.message || "Authentication failed",
      });
      console.error("Authentication failed:", err);
    }
  };

  // Step 2: Handle wallet connection after authentication
  const handleConnectWallet = () => {
    try {
      // Open Solana wallet adapter modal for wallet selection
      setVisible(true);
      setWalletStatus({
        connecting: true,
        error: null,
      });
    } catch (err) {
      setWalletStatus({
        connecting: false,
        error: err.message || "Wallet connection failed",
      });
      console.error("Failed to open wallet connection:", err);
    }
  };

  // Handle complete disconnect (both auth and wallet)
  const handleFullDisconnect = () => {
    // Disconnect Solana wallet if connected
    if (isWalletConnected) {
      disconnectWallet();
    }

    // Deauthenticate Lazorkit
    if (isAuthenticated) {
      deauthenticate();
    }

    setWalletStatus({
      connecting: false,
      error: null,
    });

    console.log("Fully disconnected");
  };

  // Update status when wallet connects
  useEffect(() => {
    if (isWalletConnected) {
      setWalletStatus({
        connecting: false,
        error: null,
      });
      console.log("Wallet connected:", walletPublicKey?.toString());
    }
  }, [isWalletConnected, walletPublicKey]);

  // Handle errors from authentication
  useEffect(() => {
    if (authError) {
      setWalletStatus((prev) => ({
        ...prev,
        error: authError,
        connecting: false,
      }));
    }
  }, [authError]);

  // Example sign message function
  const handleSignMessage = async () => {
    try {
      const message = new TextEncoder().encode("Hello from Carbonio!");
      const signature = await signMessage(message);
      console.log("Signature:", signature);
    } catch (err) {
      console.error("Failed to sign message:", err);
    }
  };

  // Determine what to display in the wallet section
  const renderWalletSection = () => {
    // Fully connected state (both authenticated and wallet connected)
    if (isAuthenticated && isWalletConnected) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-white bg-black bg-opacity-20 px-2 py-1 rounded">
            {formatPublicKey(walletPublicKey)}
          </span>
          <button
            onClick={handleSignMessage}
            className="text-white hover:text-black transition-all duration-200"
          >
            Sign
          </button>
          <button
            onClick={handleFullDisconnect}
            className="text-white hover:text-black transition-all duration-200"
          >
            Disconnect
          </button>
        </div>
      );
    }

    // Only authenticated, but wallet not connected
    if (isAuthenticated && !isWalletConnected) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-white bg-black bg-opacity-20 px-2 py-1 rounded">
            Auth: {formatPublicKey(authPublicKey || smartWalletAuthorityPubkey)}
          </span>
          <button
            onClick={handleConnectWallet}
            disabled={walletStatus.connecting}
            className="hover:text-black transition-all duration-200 disabled:opacity-50"
          >
            {walletStatus.connecting ? "Connecting..." : "Connect Wallet"}
          </button>
          <button
            onClick={handleFullDisconnect}
            className="text-white hover:text-black transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      );
    }

    // Not authenticated state
    return (
      <div>
        <button
          onClick={handleAuthenticate}
          disabled={isAuthLoading || walletStatus.connecting}
          className="hover:text-black transition-all duration-200 disabled:opacity-50"
        >
          {isAuthLoading || walletStatus.connecting
            ? "Authenticating..."
            : "Connect Wallet"}
        </button>
      </div>
    );
  };

  return (
    <div className="w-full p-2 sm:p-4 md:sticky md:z-40 top-0 transition-all duration-200">
      <div className="mx-auto bg-white border-black border-2 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-2 rounded">
        <div>
          <Link
            to="/"
            className="text-purple-700 w-auto text-xl sm:text-xl font-bold pl-2 sm:pl-3"
          >
            carbonio
            <span className="text-black w-auto text-xl sm:text-xl font-bold">
              Partner
            </span>
          </Link>
        </div>
        <div className="w-full sm:w-fit text-white text-base sm:text-lg md:text-lg flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center sm:justify-end bg-purple-700 px-2 sm:px-3 py-1">
          <Link to="/" className="hover:text-black transition-all duration-200">
            Upload
          </Link>
          <Link
            className="hover:text-black transition-all duration-200"
            to="/profile"
          >
            Profile
          </Link>

          {/* Wallet Connection UI */}
          {renderWalletSection()}

          {/* Error display */}
          {walletStatus.error && (
            <div className="text-red-300 text-sm">{walletStatus.error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
