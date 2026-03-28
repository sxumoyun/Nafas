import { useEffect, useState } from "react";
import { updateLocation } from "../services/auth";
import { useAuthStore } from "../store/authStore";

interface Location {
  latitude: number;
  longitude: number;
}

export function useLocation() {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Brauzeringiz joylashuvni qo'llab-quvvatlamaydi");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });
        setLoading(false);

        // Foydalanuvchi login qilgan bo'lsa — koordinatlarni backendga yuborish
        if (token) {
          try {
            await updateLocation([latitude, longitude]);
            console.log("Joylashuv saqlandi:", latitude, longitude);
          } catch (err) {
            console.error("Joylashuvni saqlashda xato:", err);
          }
        }
      },
      () => {
        setError("Joylashuv aniqlanmadi");
        setLoading(false);
      },
    );
  }, [token]);

  return { location, error, loading };
}
