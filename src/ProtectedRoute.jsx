import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "./CreateSupa.jsx";

export default function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsLoading(false);

      if (!session) {
        navigate("/login");
      }
    };

    fetchSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          navigate("/login");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) return <div>Loading...</div>;

  return session ? children : null;
}
