import { useAppStore } from "@/features/auth/stores/appStore";

const AboutPage = () => {
  const isInitialized = useAppStore((state) => state.isInitialized);
  const setInitialized = useAppStore((state) => state.setInitialized);

  return (
    <main>
      <h1>spotQ About</h1>

      <p>Application initialized: {isInitialized ? "Yes" : "No"}</p>

      <button type="button" onClick={() => setInitialized(!isInitialized)}>
        Initialize
      </button>
    </main>
  );
};

export default AboutPage;
