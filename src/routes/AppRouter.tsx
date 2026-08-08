import { BrowserRouter, Route, Routes } from "react-router-dom";


import { ROUTES } from "./routes";
import HomePage from "../pages/HomePage";
import AboutPage from "../pages/AboutPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;