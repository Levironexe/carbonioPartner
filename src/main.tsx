import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Upload from "./pages/Upload.tsx";
import Statistic from "./pages/Statistic.tsx";
import History from "./pages/History.tsx";
// import WalletContextProvider from "./contexts/WalletContext.tsx";
import Profile from "./pages/Profile.tsx";

const routers = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // {
      //   index: true,
      //   element: <Home />,
      // },
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
    <RouterProvider router={routers} />
  </StrictMode>
);
