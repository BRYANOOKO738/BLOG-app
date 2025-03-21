import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import store, { persistor } from "./redux/Store.js"; // Corrected import
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./Components/ThemeProvider.jsx";
import Footer from "./Components/Footer/Footer";
import "./index.css";
import ScrollToTop from "./Components/ScrollToTop.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {" "}
      {/* 'store' from default import */}
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <ScrollToTop/>
          <ThemeProvider>
            <App />
            {/* <div className="relative z-10 bg-gray-200">
              <Footer />
            </div> */}
          </ThemeProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
);
