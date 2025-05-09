import React, { useState, ChangeEvent, useRef } from "react";
import * as XLSX from "xlsx";
import emission from "../assets/emission2.webp";
import { LoaderCircle, X, FileUp, CheckCircle } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import createCollection, {
  CreateCollectionParams,
} from "../script/CreateCollection";

import createNFT, { CreateNFTParams } from "../script/CreateNFT";

import { useCompanyActions } from "../anchor/company-utils";

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
  qrCodeImage?: string;
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
const REQUIRED_COLUMNS = [
  "Product Name",
  "Product ID",
  "Product Description",
  "Product Image",
  "Product Category",
  "Total Carbon Footprint (kg CO₂e)",
  "Verification Status",
  "Production Stage Name",
  "Production Stage Description",
  "Stage Order",
  "CO₂ Equivalent (kg)",
  "Measurement Unit",
];

const Upload: React.FC = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [productPreview, setProductPreview] = useState<
    ProductPreview | undefined
  >();

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [uploadedProducts, setUploadedProducts] = useState<Map<number, string>>(
    new Map()
  );
  const { fetchCompanyData, addProduct } = useCompanyActions();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { publicKey } = useWallet();
  const wallet = useWallet();
  const walletAddress = publicKey?.toBase58();

  const validateExcelTemplate = (jsonData: Record<string, string>[]) => {
    if (jsonData.length === 0) {
      return "The uploaded file is empty.";
    }

    // Check if all required columns are present
    const firstRow = jsonData[0];
    const missingColumns = REQUIRED_COLUMNS.filter((col) => !(col in firstRow));

    if (missingColumns.length > 0) {
      return `The file is missing required columns: ${missingColumns.join(
        ", "
      )}. Please use our template.`;
    }

    return "";
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
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

        // Validate template
        const validationError = validateExcelTemplate(jsonData);
        if (validationError) {
          setError(validationError);
          return;
        }

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
        setError(
          "Failed to read Excel file. Please ensure it's a valid Excel file."
        );
      }
    };

    reader.onerror = () => {
      setError("Error reading file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const clearFileInput = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setGroupedProducts([]);
    setError("");
    setSuccess("");
  };

  // Fix for the "Cannot read properties of undefined (reading 'name')" error
  // Look for this section in the pushDataToBackend function

  const pushDataToBackend = async (product: GroupedProduct, index: number) => {
    // Check wallet connection
    if (!walletAddress) {
      setError("Wallet not connected");
      return;
    }

    // Set loading state
    setLoadingIndex(index);

    try {
      // Step 1: Prepare request data
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
        wallet: undefined,
      };

      // Step 2: Post product data to backend and get IPFS metadata
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

      // Check if response is valid JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const result = await response.json();

      if (!response.ok || !result) {
        throw new Error(result?.error || "Unknown server error");
      }

      console.log("Success Response:", result);
      setSuccess(`Product "${product.info.name}" uploaded successfully!`);

      // Step 3: Update product preview with metadata
      setProductPreview({
        name: result.metadata_preview?.name || product.info.name,
        imageUrl: result.metadata_preview?.image || product.info.image,
        description:
          result.metadata_preview?.description || product.info.description,
        attributes: result.metadata_preview?.attributes || [],
      });

      // Step 4: Create blockchain collection
      const collectionParams: CreateCollectionParams = {
        name: product.info.name,
        symbol: product.info.id,
        metadataUri: result.ipfs_metadata_url,
      };

      console.log(
        "Creating collection with metadata:",
        result.ipfs_metadata_url
      );
      const collectionResult = await createCollection(wallet, collectionParams);

      // Step 5: Create NFTs for each stage if collection was created successfully
      if (collectionResult?.collectionAddress) {
        console.log(
          "Collection created with address:",
          collectionResult.collectionAddress
        );

        for (let i = 0; i < product.stages.length; i++) {
          const stage = product.stages[i];
          const metadataUri = result.ipfs_metadata_url_NFT?.[i];

          if (!metadataUri) {
            console.warn(`No metadata URI found for stage ${i + 1}`);
            continue;
          }

          // Handle different metadata URI formats
          const metadataUriValue =
            typeof metadataUri === "string"
              ? metadataUri
              : metadataUri.metadataUri;

          const NFTParams: CreateNFTParams = {
            name: stage.name,
            symbol: product.info.id,
            metadataUri: metadataUriValue,
            collectionMint: collectionResult.collectionAddress,
          };

          try {
            const nftResult = await createNFT(wallet, NFTParams);
            console.log(`NFT created for stage ${i + 1}:`, nftResult);
          } catch (nftError) {
            console.error(`Error creating NFT for stage ${i + 1}:`, nftError);
          }
        }

        // Step 6: Generate QR code with blockchain reference
        try {
          console.log(result.product_id);
          const qrCodePayload = {
            productId: result.product_id,
            blockchainRef: collectionResult.collectionAddress,
          };

          const qrResponse = await fetch(
            "https://carbonio-backend.onrender.com/products/created/qr",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(qrCodePayload),
            }
          );
          if (qrResponse.ok) {
            const qrResult = await qrResponse.json();
            console.log("QR code generated:", qrResult);

            // Check if qr_code_data exists
            if (qrResult.qr_code_data) {
              // Make a copy of the groupedProducts array and update the qrCodeImage for the specific product
              const updatedProducts = [...groupedProducts];
              updatedProducts[index] = {
                ...updatedProducts[index],
                qrCodeImage: qrResult.qr_code_data, // Update qrCodeImage for the specific product
              };

              // Set the updated products state
              setGroupedProducts(updatedProducts);
            }
          }
        } catch (qrError) {
          console.error("Error generating QR code:", qrError);
          // Continue execution even if QR code generation fails
        }
      } else {
        console.error("Failed to create collection");
      }
    } catch (err) {
      console.error("Request Error:", err);
      setError(
        `An error occurred while uploading product "${product.info.name}". ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      // Step 7: Update blockchain product count and clean up
      setLoadingIndex(null);

      try {
        if (publicKey) {
          await addProduct(publicKey.toString());
          const data = await fetchCompanyData(publicKey.toString());
          console.log("Updated company data:", data);
        }
      } catch (error) {
        console.error("Error adding product number to blockchain:", error);
      }
    }
  };

  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  // Toggle expansion state for a specific product by index
  const toggleExpand = (index: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Format the carbon footprint to be more readable
  const formatCarbonValue = (value: any) => {
    return parseFloat(value).toFixed(2);
  };

  // Calculate carbon status color based on footprint
  const getCarbonStatusColor = (footprint: any) => {
    const value = parseFloat(footprint);
    if (value < 10) return "bg-green-100 text-green-800";
    if (value < 30) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const onDeleteProduct = (index: number) => {
    const newProducts = groupedProducts.filter((_, i) => i !== index);
    setGroupedProducts(newProducts);

    // Remove from uploaded products map
    const newUploadedProducts = new Map(uploadedProducts);
    newUploadedProducts.delete(index);
    setUploadedProducts(newUploadedProducts);

    // If no products left, clear the file input
    if (newProducts.length === 0) {
      clearFileInput();
    }
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
        <div className="border-dashed border-2 border-gray-400 rounded p-8 mb-6 bg-white shadow-sm">
          <div className="flex flex-col items-center justify-center">
            {!fileName ? (
              <>
                <div className="mb-4 bg-purple-100 p-4 rounded-full">
                  <FileUp size={32} className="text-purple-700" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  Upload Product Data
                </h3>
                <p className="text-gray-500 text-sm text-center mb-4">
                  Upload your Excel file using our template to track CO₂
                  emissions.
                  <br />
                  Make sure all required columns are included.
                </p>
                <label className="relative inline-flex items-center px-6 py-3 bg-purple-700 text-white font-medium rounded hover:bg-purple-800 transition-colors duration-200 cursor-pointer">
                  <span>Choose Excel File</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv, .xlsx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded mb-4">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded mr-3">
                      <CheckCircle size={20} className="text-purple-700" />
                    </div>
                    <div>
                      <p className="font-medium">{fileName}</p>
                      <p className="text-xs text-gray-500">
                        {groupedProducts.length} products found
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFileInput}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex justify-center">
                  <label className="relative inline-flex items-center px-6 py-2 bg-purple-100 text-purple-700 font-medium rounded hover:bg-purple-200 transition-colors duration-200 cursor-pointer">
                    <span>Replace File</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv, .xlsx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{success}</p>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 sm:px-6 md:px-10">
        {groupedProducts.length > 0 && (
          <div className="space-y-6">
            {groupedProducts.map((product, index) => {
              const isExpanded = !!expandedItems[index];
              return (
                <div className="bg-white rounded shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg border-carbon">
                  <div key={index} className="flex flex-col md:flex-row">
                    {/* Product Image Section */}
                    <div className="w-full md:w-1/3 p-4 md:border-r border-gray-200">
                      <div className="aspect-square overflow-hidden rounded bg-gray-100">
                        {product.info.image ? (
                          <img
                            className="w-full h-full object-cover rounded"
                            src={product.info.image}
                            alt={product.info.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                            No image
                          </div>
                        )}
                      </div>

                      {/* QR Code Section - conditionally displayed */}
                      {groupedProducts[index]?.qrCodeImage && (
                        <div className="mt-4 flex flex-col items-center p-3 bg-purple-50 rounded">
                          <h4 className="text-sm font-medium mb-2 text-purple-800">
                            Product QR Code
                          </h4>
                          <img
                            src={groupedProducts[index].qrCodeImage} // Use the updated qrCodeImage for this product
                            alt="Product QR Code"
                            className="w-full max-w-[120px] h-auto"
                          />
                          <p className="text-xs text-center mt-2 text-gray-600">
                            Scan to view carbon details
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Information Section */}
                    <div className="flex-1 p-4 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h2 className="text-xl font-semibold text-gray-900">
                          {product.info.name}
                        </h2>
                        <div
                          className={`px-3 py-1 rounded text-xs font-medium ${getCarbonStatusColor(
                            product.info.footprint
                          )}`}
                        >
                          {formatCarbonValue(product.info.footprint)} kg CO₂e
                        </div>
                      </div>

                      <div className="mt-2 grid  gap-2">
                        <div className="text-gray-700 text-sm">
                          <span className="font-bold">Category:</span>{" "}
                          {product.info.category}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mt-2">
                        {product.info.description}
                      </p>

                      {/* Production Stages - Expandable */}
                      <div className="mt-4">
                        <button
                          onClick={() => toggleExpand(index)}
                          className="flex items-center text-sm font-medium text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                        >
                          <span>
                            {isExpanded ? "Hide" : "Show"} Production Stages
                          </span>
                          <svg
                            className={`ml-1 w-4 h-4 transform transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>

                        {isExpanded && (
                          <div className="mt-2 space-y-4">
                            {product.stages.map((stage, i) => (
                              <div key={i}>
                                <div className="group relative transition-all duration-300">
                                  <div className="absolute inset-0 bg-carbon transition-all duration-300 group-hover:-bottom-2 group-hover:-right-2 rounded-[4px]"></div>
                                  <a
                                    className="relative"
                                    href="/privacy-policy"
                                  >
                                    <div className="p-4 shadow z-10 bg-white border-carbon border-2 rounded">
                                      <div className="flex justify-between">
                                        <span className="font-medium text-sm">
                                          {stage.name}
                                        </span>
                                        <span className="text-sm text-gray-700">
                                          {stage.co2}
                                          {stage.unit}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600">
                                        {stage.description}
                                      </p>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto pt-4 flex gap-3 justify-end">
                        <button
                          className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => onDeleteProduct(index)}
                        >
                          Delete
                        </button>

                        {!product.qrCodeImage && (
                          <button
                            onClick={() => pushDataToBackend(product, index)}
                            className="px-4 py-2 bg-purple-700 text-white font-medium rounded hover:bg-purple-800 transition-colors duration-200 flex items-center justify-center"
                            disabled={loadingIndex === index}
                          >
                            {loadingIndex === index ? (
                              <div className="flex items-center">
                                <span>Uploading</span>
                                <LoaderCircle className="animate-spin w-4 h-4 ml-2" />
                              </div>
                            ) : (
                              "Generate QR"
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
