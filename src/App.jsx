import AppRoutes from "./routes/AppRoutes";
import useAuth from "./hooks/useAuth";

function App() {
  useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-cream-50)] text-[var(--color-coffee-800)] font-sans">
      <AppRoutes />
    </div>
  );
}

export default App;
