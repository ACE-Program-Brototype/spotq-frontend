import { useLogout } from "@/features/auth/hooks/use-logout";
import { useAuthStore } from "@/features/auth/store/auth.store";

const HomePage = () => {
  const { user } = useAuthStore();
  const { handleLogout, isLoading: isLoggingOut } = useLogout();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", lineHeight: "1.6" }}>
      <div>
        <strong>Customer Name:</strong> {user?.fullName}
      </div>
      <div>
        <strong>Email Address:</strong> {user?.email}
      </div>
      <div style={{ marginTop: "15px" }}>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{ cursor: isLoggingOut ? "not-allowed" : "pointer" }}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
