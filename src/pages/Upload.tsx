import React, { useState, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import emission from "../assets/emission2.webp";
import { LoaderCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import createCollection, {
  CreateCollectionParams,
} from "../script/CreateCollection";

// Define types for our data structure
interface ProductStage {
  name: string;
  description: string;
  order: string;
  co2: string;
  unit: string;
  recordedDate: string;
}

interface ProductInfo {
  name: string;
  id: string;
  detail: string;
  description: string;
  image: string;
  category: string;
  footprint: string;
  status: string;
  date: string;
}

interface GroupedProduct {
  info: ProductInfo;
  stages: ProductStage[];
}

interface ProductPreview {
  name: string;
  imageUrl: string;
  description: string;
  attributes: any[];
  qrCodeImage?: string;
}

interface BackendRequestData {
  product: {
    company_address: string;
    name: string;
    id: string;
    description: string;
    category: string;
    image: string;
  };
  stages: {
    name: string;
    description: string;
    co2_equivalent: string;
    measurement_unit: string;
  }[];
  wallet: any;
}

interface BackendResponse {
  product_id: string;
  ipfs_metadata_url: string;
  ipfs_image_url: string;
  metadata_preview: {
    name: string;
    image: string;
    description: string;
    attributes: any[];
  };
  qr_code_image?: string;
}

const Upload: React.FC = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [productPreview, setProductPreview] = useState<
    ProductPreview | undefined
  >();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58();

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
        }) as Record<string, string>[];

        const grouped: Record<string, GroupedProduct> = {};
        jsonData.forEach((row) => {
          const productName = row["Product Name"] || "Unnamed Product";

          if (!grouped[productName]) {
            grouped[productName] = {
              info: {
                id: row["Product ID"],
                name: productName,
                detail: row["Product Detail"],
                description: row["Product Description"],
                image: row["Product Image"],
                category: row["Product Category"],
                footprint: row["Total Carbon Footprint (kg CO₂e)"],
                status: row["Verification Status"],
                date: row["Verification Date (YYYY-MM-DD)"],
              },
              stages: [],
            };
          }

          grouped[productName].stages.push({
            name: row["Production Stage Name"],
            description: row["Production Stage Description"],
            order: row["Stage Order"],
            co2: row["CO₂ Equivalent (kg)"],
            unit: row["Measurement Unit"],
            recordedDate: row["Emission Recorded Date (YYYY-MM-DD)"],
          });
        });

        setGroupedProducts(Object.values(grouped));
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to read Excel file.");
      }
    };

    reader.onerror = () => {
      setError("Error reading file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const pushDataToBackend = async (product: GroupedProduct, index: number) => {
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    const requestData: BackendRequestData = {
      product: {
        company_address: walletAddress,
        name: product.info.name,
        id: product.info.id,
        description: product.info.description,
        category: product.info.category,
        image: product.info.image,
      },
      stages: product.stages.map((stage) => ({
        name: stage.name,
        description: stage.description,
        co2_equivalent: stage.co2,
        measurement_unit: stage.unit,
      })),
      wallet: undefined, // This seems to be undefined in the original code
    };

    setLoadingIndex(index);

    try {
      const response = await fetch(
        "https://carbonio-backend.onrender.com/products/created",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const result = (await response.json()) as BackendResponse;

      if (response.ok) {
        console.log("Success Response:", result);
        setSuccess(`Product "${product.info.name}" uploaded successfully!`);

        setProductPreview({
          name: result.metadata_preview.name,
          imageUrl: result.metadata_preview.image,
          description: result.metadata_preview.description,
          attributes: result.metadata_preview.attributes,
          //qrCodeImage: result.qr_code_image,
        });

        //make the params for collection creating

        const collectionParams: CreateCollectionParams = {
          name: product.info.name,
          symbol: product.info.id, // productId doesn't exist in the GroupedProduct type
          metadataUri: result.ipfs_metadata_url,
        };

        //call the function to create the new collection
        //createCollection(collectionParams);
      } else {
        // Log server-side error details
        console.error("Server Error:", result);
        setError(
          `Failed to upload product "${
            product.info.name
          }". Server responded with: ${"Unknown error"}`
        );
      }
    } catch (err) {
      console.error("Request Error:", err); // Log any network errors or other issues
      setError(
        `An error occurred while uploading product "${product.info.name}".`
      );
    } finally {
      setLoadingIndex(null);
      onDeleteProduct(index);
    }
  };

  const onDeleteProduct = (index: number) => {
    setGroupedProducts(groupedProducts.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-[146px]">
      <div className="px-4 sm:px-6 md:px-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 h-auto">
          <div className="w-full md:flex-[3] bg-gradient-to-b rounded-[4px] text-left flex flex-col justify-end mb-12">
            <div className="flex flex-col justify-end h-auto">
              <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-black font-semibold">
                <span className="text-purple-700">Upload</span> your product
                data to track CO₂ emissions
                <br />
                <span className="text-purple-700 font-semibold">
                  Smart, Simple & Transparent.
                </span>
              </h1>
              <p>
                Upload your product lifecycle data to instantly calculate and
                visualize carbon footprints. Our platform helps businesses
                understand their environmental impact and supports transparent
                sustainability reporting.
              </p>
            </div>
          </div>
          <div className="w-full md:flex-[2] relative mt-4 md:mt-0 flex items-end">
            <div className="rounded-[50px] w-full relative aspect-[4/3] bg-transparent">
              <img
                alt="carbon emission"
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain rounded-[20px]"
                src={emission}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-10">
        <div className="border-dashed border-2 border-gray-400 rounded p-6 mb-6 bg-white">
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:text-sm file:font-semibold
            file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 file:cursor-pointer cursor-pointer"
          />
          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-10">
        {groupedProducts.length > 0 && (
          <div className="space-y-6 ">
            {groupedProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded shadow-carbon border-carbon"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3 aspect-square overflow-hidden rounded ">
                    <img
                      className="w-full h-full object-cover rounded"
                      src={product.info.image}
                      alt={product.info.name}
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold">
                      {product.info.name}
                    </h2>
                    <p className="text-gray-700 text-sm">
                      <strong>Description:</strong> {product.info.description}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Category:</strong> {product.info.category}
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Total Carbon:</strong> {product.info.footprint} kg
                      CO₂e
                    </p>
                    <p className="text-gray-700 text-sm">
                      <strong>Verification:</strong> {product.info.status} (
                      {product.info.date})
                    </p>
                    <h3 className="font-semibold mt-4">Production Stages:</h3>
                    <ol className="list-decimal list-inside space-y-1">
                      {product.stages.map((stage, i) => (
                        <li key={i}>
                          <strong>{stage.name}</strong> – {stage.description} |{" "}
                          {stage.co2}
                          {stage.unit}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-auto flex gap-4 mt-4 w-full items-center justify-end ">
                      <button
                        className="px-4 py-1 border border-purple-700 text-purple-700 font-medium rounded hover:bg-purple-50 transition-colors duration-200 cursor-pointer"
                        onClick={() => onDeleteProduct(index)}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => pushDataToBackend(product, index)}
                        className="px-4 py-1 bg-purple-700 text-white font-medium rounded hover:bg-purple-800 transition-colors duration-200 cursor-pointer"
                        disabled={loadingIndex === index}
                      >
                        {loadingIndex === index ? (
                          <div className="flex gap-1 align-center">
                            Uploading
                            <LoaderCircle className="spinner" />
                          </div>
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {productPreview && (
              <div>
                {productPreview.qrCodeImage && (
                  <div>
                    <img src={productPreview.qrCodeImage} alt="QR Code" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
