import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>404: Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/">Go to home</Link>
    </div>
  );
}

export default NotFoundPage;