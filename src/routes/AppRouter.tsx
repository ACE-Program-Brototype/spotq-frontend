import { BrowserRouter, Route, Routes } from "react-router-dom";
import AboutPage from "../pages/AboutPage";
import HomePage from "../pages/HomePage";
import { ROUTES } from "./routes";

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
