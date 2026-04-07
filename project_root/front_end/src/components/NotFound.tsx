import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div>
          <h1 className="text-4xl font-bold">404</h1>
          <p className="py-4">You were looking in the wrong place.</p>
          <Link to="/" className="btn btn-primary">Go to Landing</Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
