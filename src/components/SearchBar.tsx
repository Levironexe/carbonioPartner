// // src/components/SearchBar.jsx
// import { useState } from "react";

// const SearchBar = ({ onSearch }) => {
//   const [input, setInput] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (input.trim() !== "") {
//       onSearch(input.trim());
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="flex items-center gap-2">
//       <input
//         type="text"
//         placeholder="Enter wallet address or tx signature"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         className="border p-2 rounded w-full"
//       />
//       <button
//         type="submit"
//         className="bg-purple-700 text-white px-4 py-2 rounded"
//       >
//         Search
//       </button>
//     </form>
//   );
// };

// export default SearchBar;
