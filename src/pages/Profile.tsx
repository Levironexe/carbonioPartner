import { useEffect, useState } from "react";
import {
  ArrowRight,
  CircleCheck,
  Wallet,
  History,
  ExternalLink,
  CircleXIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCompanyActions } from "../anchor/company-utils";

// Define interfaces for our data structures

interface Upload {
  id: number;
  product: string;
  stage: string;
  emission: number;
  date: string;
  status: "Verified" | "Pending";
  nftLink: string;
}

const mockUploads: Upload[] = [
  {
    id: 1,
    product: "Eco Bottle",
    stage: "Packaging",
    emission: 23.5,
    date: "2025-04-20",
    status: "Verified",
    nftLink: "#",
  },
  {
    id: 2,
    product: "Eco Bottle",
    stage: "Transport",
    emission: 40.2,
    date: "2025-04-21",
    status: "Pending",
    nftLink: "#",
  },
  {
    id: 3,
    product: "Paper Wrap",
    stage: "Production",
    emission: 55.1,
    date: "2025-04-17",
    status: "Verified",
    nftLink: "#",
  },
  // Additional mock uploads here
];

const Profile: React.FC = () => {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const { publicKey, connected, connect, disconnect } = useWallet();

  const [mockCompany, setMockCompany] = useState({
    name: "Company not registered",
    verified: false,
    joinedOn: "NA",
  });
  const { fetchCompanyData } = useCompanyActions();

  useEffect(() => {
    setUploads(mockUploads);
  }, []);

  useEffect(() => {
    const fetchDataFromCompany = async () => {
      if (publicKey === null) return null;
      try {
        const data = await fetchCompanyData(publicKey.toString());
        console.log(data);
        if (data) {
          setMockCompany({
            name: data.companyName,
            verified: data.verificationStatus === "Verified" ? true : false,
            joinedOn: data.verificationTime,
          });
        }
      } catch (error) {
        console.error("Error fetching company data from blockchain:", error);
      }
    };

    fetchDataFromCompany();
  }, [publicKey]);

  const handleConnect = async (): Promise<void> => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    if (filter === "All") {
      setUploads(mockUploads);
    } else {
      setUploads(mockUploads.filter((upload) => upload.status === filter));
    }
  };

  const truncateWalletAddress = (address?: string): string => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  console.log(mockCompany.joinedOn);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 ">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
        <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-semibold">
          My Wallet
        </h1>

        {connected ? (
          <div className="flex items-center gap-2 bg-purple-50 px-4 py-2 rounded">
            <Wallet className="text-purple-700" size={18} />
            <span className="font-medium text-purple-900">
              {truncateWalletAddress(publicKey?.toBase58())}
            </span>
            <button
              onClick={() => disconnect()}
              className="text-xs text-purple-700 hover:text-purple-900 underline ml-2"
            >
              Disconnect
            </button>
          </div>
        ) : null}
      </div>

      {!connected ? (
        <div className="bg-white rounded shadow-lg p-8 flex flex-col items-center text-center border-carbon">
          <div className="bg-purple-100 p-4 rounded-full mb-4">
            <Wallet size={32} className="text-purple-700" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your Solana wallet to view your profile and upload history.
          </p>
          <button
            className="bg-purple-700 hover:bg-purple-800 rounded px-6 py-3 text-white font-medium flex items-center transition-all duration-200 cursor-pointer"
            onClick={handleConnect}
          >
            Connect Wallet <ArrowRight className="ml-2" size={18} />
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow p-6 mb-8 border-carbon">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {mockCompany.name}
                </h2>
                {mockCompany.verified ? (
                  <CircleCheck size={18} className="text-green-600" />
                ) : (
                  <CircleXIcon size={18} className="text-red-600" />
                )}
              </div>

              <div className="text-sm text-gray-500 mt-1 md:mt-0">
                {mockCompany.joinedOn !== "Not verified yet"
                  ? `Member since ${mockCompany.joinedOn}`
                  : "Not verified yet"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded shadow-lg border-carbon">
            <div className="border-b border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <History className="text-purple-700" size={20} />
                  <h2 className="text-xl font-bold">Upload History</h2>
                </div>

                <div className="flex items-center bg-gray-100 rounded p-1">
                  {["All", "Verified", "Pending"].map((filter) => (
                    <button
                      key={filter}
                      className={`px-4 py-1 text-sm rounded transition-colors ${
                        activeFilter === filter
                          ? "bg-purple-700 text-white"
                          : "text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => handleFilterChange(filter)}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emission
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NFT
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {uploads.length > 0 ? (
                    uploads.map((u, i) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {u.product}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {u.stage}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {u.emission} kg CO₂e
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {format(new Date(u.date), "MMM dd, yyyy")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                              u.status === "Verified"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <a
                            href={u.nftLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                          >
                            View <ExternalLink size={14} />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No uploads found matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 text-right">
              <p className="text-sm text-gray-500">
                Showing {uploads.length} of {mockUploads.length} uploads
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
