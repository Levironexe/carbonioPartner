import { useEffect, useState } from "react";
import { ArrowRight, CircleCheck, CircleX } from "lucide-react";
import { format } from "date-fns";
import { useWallet } from "@solana/wallet-adapter-react";

// Define interfaces for our data structures
interface Company {
  name: string;
  verified: boolean;
  joinedOn: string;
}

interface Upload {
  id: number;
  product: string;
  stage: string;
  emission: number;
  date: string;
  status: "Verified" | "Pending";
  nftLink: string;
}

const mockCompany: Company = {
  name: "EcoPack Co., Ltd",
  verified: true,
  joinedOn: "2025-03-10",
};

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
  const { publicKey, connected, connect, disconnect } = useWallet();

  useEffect(() => {
    setUploads(mockUploads);
  }, []);

  const handleConnect = async (): Promise<void> => {
    try {
      await connect();
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-semibold">
        My Wallet
      </h1>
      <div>
        <div>
          {connected ? (
            <>
              <p>Wallet Address: {publicKey?.toBase58()}</p>
              <div>
                <h2 className="flex gap-2 align-center">
                  <span className="text-xl font-bold mb-2">
                    {mockCompany.name}
                  </span>
                  {mockCompany.verified ? (
                    <CircleCheck className="text-green-700" />
                  ) : (
                    <CircleX className="text-red-700" />
                  )}
                </h2>
                <p>
                  <strong>Joined On:</strong> {mockCompany.joinedOn}
                </p>
              </div>

              {/* Upload Summary */}
              <div>
                <div className="p-6">
                  <div>
                    <div>
                      <h2 className="mb-4 text-2xl font-bold">
                        Upload Summary
                      </h2>
                    </div>
                    <div className="flex justify-between">
                      <p> Total Products Uploaded: {uploads.length}</p>
                      <p> Total Stages Minted: {uploads.length}</p>
                      <p>
                        Last Upload: {uploads.length ? uploads[0].date : "N/A"}
                      </p>
                      <p>
                        ✅ Verified Products:{" "}
                        {uploads.filter((u) => u.status === "Verified").length}
                      </p>
                      <p>
                        ❌ Pending Verification:{" "}
                        {uploads.filter((u) => u.status === "Pending").length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[4px] border-2 border-carbon px-2 sm:px-4 py-4 shadow-lg shadow-carbon">
                <h2 className="mb-4 text-2xl font-bold">Upload History</h2>
                <div className="overflow-x-auto mt-5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">#</th>
                        <th className="p-2">Product</th>
                        <th className="p-2">Stage</th>
                        <th className="p-2">Emission</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">NFT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploads.map((u, i) => (
                        <tr key={u.id} className="border-b">
                          <td className="p-2">{i + 1}</td>
                          <td className="p-2">{u.product}</td>
                          <td className="p-2">{u.stage}</td>
                          <td className="p-2">{u.emission} kg CO2e</td>
                          <td className="p-2">
                            {format(new Date(u.date), "yyyy-MM-dd")}
                          </td>
                          <td className="p-2">{u.status}</td>
                          <td className="p-2">
                            <a
                              href={u.nftLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <button
              className=" bg-purple-800 hover:bg-purple-700 rounded-[4px] h-full p-2 sm:p-3 text-white shadow-purple-800 shadow-lg flex justify-between items-center text-base sm:text-lg md:text-xl lg:text-[18px] transition-all duration-200 cursor-pointer"
              onClick={handleConnect}
            >
              Connect wallet to access <ArrowRight className="ms-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
