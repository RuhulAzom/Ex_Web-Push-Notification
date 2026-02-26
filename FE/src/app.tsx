import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

// Konversi base64 string ke Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleResubscribe = useDebouncedCallback(async () => {
    setIsLoading(true);
    if ("serviceWorker" in navigator) {
      try {
        // Check notification permission
        console.log(
          "Current notification permission:",
          Notification.permission,
        );

        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          console.log("Requested permission:", permission);
          if (permission !== "granted") {
            console.warn("❌ Notification permission not granted");
            alert("Please enable notifications in your browser settings");
            setIsLoading(false);
            return;
          }
        } else if (Notification.permission === "denied") {
          console.warn(
            "❌ Notification permission is denied. Please change it in browser settings.",
          );
          alert(
            "Notification permission is denied. Please change it in browser settings.",
          );
          setIsLoading(false);
          return;
        }

        // Unregister old SW and register fresh one
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (registrations.length > 0) {
          return;
        }

        console.log({ registrations });

        for (let reg of registrations) {
          await reg.unregister();
        }

        // Register service worker fresh
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("✅ Service worker registered/updated");

        // Tunggu sampai SW benar-benar active dengan polling
        let isActive = false;
        let attempts = 0;
        const maxAttempts = 20;

        while (!isActive && attempts < maxAttempts) {
          if (registration.active) {
            isActive = true;
            console.log("✅ Service worker is now active!");
            break;
          }
          attempts++;
          console.log(
            `Waiting for SW to activate... attempt ${attempts}/${maxAttempts}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 100)); // Wait 100ms
        }

        if (!isActive) {
          throw new Error(
            "Service Worker failed to activate after multiple attempts",
          );
        }

        // Check existing subscription
        let subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          console.log("Existing subscription found, deleting...");
          await subscription.unsubscribe();
        }

        // Create new subscription
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo",
          ),
        });

        console.log("✅ New push subscription created:", subscription);

        // Kirim subscription ke backend
        const res = await fetch("http://localhost:4000/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: {
            "content-type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to subscribe: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Subscription sent to backend:", data);
        alert("✅ Subscription successful! You can now receive notifications.");
      } catch (error: any) {
        console.error("❌ Error:", error);
        alert("Error: " + error.message);
      }
    }
    setIsLoading(false);
  }, 1000);

  useEffect(() => {
    handleResubscribe();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        gap: "10px",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Push Notification Test</h2>
    </div>
  );
}
