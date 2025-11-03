import { Route, Routes } from "react-router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { publicRoutes } from "./routes/allRoutes";
import { MainLayout } from "./Components/Layout/MainLayout";
import { PublicRoute } from "./routes/PublicRoute";
import { ReviewProvider } from "./Context/ReviewContext";
import { ThemeProvider } from "./Context/ThemeContext";
import ErrorBoundary from "./Components/ErrorBoundary/ErrorBoundary";
import CustomCursor from "./Components/CustomCursor/CustomCursor";

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ReviewProvider>
          <CustomCursor />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Routes>
            <Route
              element={
                <PublicRoute>
                  <MainLayout />
                </PublicRoute>
              }
            >
              {publicRoutes.map((e, index) => (
                <Route key={index} path={e.path} element={e.element} />
              ))}
            </Route>
          </Routes>
        </ReviewProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};
export default App;
