import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <main>
      <h1>404</h1>
      <h2>Page Not Found</h2>

      <p>The page you are looking for does not exist or may have been moved.</p>

      <Link to="/">Go back home</Link>
    </main>
  );
};

export default NotFoundPage;
