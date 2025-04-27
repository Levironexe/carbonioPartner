import { Link } from "react-router-dom";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const NavBar = () => {
  return (
    <div className="w-full p-2 sm:p-4  md:sticky md:z-40  top-0 transition-all duration-200">
      <div className="mx-auto bg-white border-black border-2 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-2 rounded">
        <div>
          <Link
            to="/"
            className="text-purple-700 w-auto text-xl sm:text-xl font-bold pl-2 sm:pl-3 "
          >
            carbonio
            <span className="text-black w-auto text-xl sm:text-xl font-bold">
              Partner
            </span>
          </Link>
        </div>
        <div className="w-full sm:w-fit text-white text-base sm:text-lg md:text-lg flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 justify-center sm:justify-end bg-purple-700 px-2 sm:px-3 py-1">
          <Link
            to="/"
            className="hover:text-black transition-all duration-200"
          >
            Upload
          </Link>
          {/* <Link
            className="hover:text-black transition-all duration-200"
            to="statistic"
          >
            Statistic
          </Link>
          <Link
            className="hover:text-black transition-all duration-200"
            to="/history"
          >
            History
          </Link> */}
          <Link
            className="hover:text-black transition-all duration-200"
            to="/profile"
          >
            Profile
          </Link>
          <WalletMultiButton
            className="bg-purple-700"
            style={{
              fontFamily: "Oxanium",
              color: "white",
              fontWeight: "normal",
              fontSize: "1.125rem",
              height: "1.75rem",
              borderRadius: "0",
              padding: "0",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
