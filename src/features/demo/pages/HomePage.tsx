import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/store/auth.store";

const HomePage = () => {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h1>Welcome to SpotQ</h1>
        <p>Please log in to continue.</p>
        <button type="button" onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", lineHeight: "1.6" }}>
      <div>
        <strong>Customer Name:</strong> {user.fullname}
      </div>
      <div>
        <strong>Email Address:</strong> {user.email}
      </div>
      <div style={{ marginTop: "15px" }}>
        <button type="button" onClick={handleLogout} style={{ cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default HomePage;
