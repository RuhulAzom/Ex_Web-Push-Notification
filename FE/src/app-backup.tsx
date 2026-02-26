import { useEffect, useState } from "react";

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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("Checking...");
  const [swStatus, setSwStatus] = useState<string>("Checking...");
  const [isLoading, setIsLoading] = useState(false);

  const checkServiceWorkerStatus = async () => {
    if (!("serviceWorker" in navigator)) {
      setSwStatus("❌ Service Worker not supported");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration("/sw.js");
      if (registration) {
        setSwStatus("✅ Service Worker Active");
        console.log("Service Worker Registration:", registration);
      } else {
        setSwStatus("❌ Service Worker not registered");
      }
    } catch (error) {
      setSwStatus("❌ Error checking SW: " + error.message);
    }
  };

  const handleUnregisterSW = async () => {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
      setSwStatus("❌ Service Worker unregistered");
      alert("Service Worker unregistered. Refresh page to re-register.");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleResubscribe = async () => {
    setIsLoading(true);
    if ("serviceWorker" in navigator) {
      try {
        // Check notification permission
        console.log("Current notification permission:", Notification.permission);

        if (Notification.permission === "default") {
          const permission = await Notification.requestPermission();
          console.log("Requested permission:", permission);
          if (permission !== "granted") {
            console.warn("❌ Notification permission not granted");
            setSubscriptionStatus("Permission denied");
            alert("Please enable notifications in your browser settings");
            setIsLoading(false);
            return;
          }
        } else if (Notification.permission === "denied") {
          console.warn("❌ Notification permission is denied. Please change it in browser settings.");
          setSubscriptionStatus("Permission denied");
          alert("Notification permission is denied. Please change it in browser settings.");
          setIsLoading(false);
          return;
        }

        // Unregister old SW and register fresh one
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let reg of registrations) {
          await reg.unregister();
        }

        // Register service worker fresh
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("✅ Service worker registered/updated");
        setSwStatus("✅ Service Worker Active");

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
        setSubscriptionStatus("✅ Subscribed successfully");
        alert("✅ Subscription successful! You can now receive notifications.");
      } catch (error) {
        console.error("❌ Error:", error);
        setSubscriptionStatus("❌ Subscription failed");
        alert("Error: " + error.message);
      }
    }
    setIsLoading(false);
  };

  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:4000/send-notification", {
        method: "POST",
      });
      const data = await res.json();
      console.log("Notification response:", data);
      if (res.ok) {
        alert(`✅ Notification sent! (${data.successful} successful, ${data.failed} failed)`);
        // Wait for notification to appear
        console.log("Check your notifications in 2-3 seconds...");
      } else {
        alert("⚠️ " + data.error);
        if (data.error.includes("No subscriptions")) {
          setSubscriptionStatus("❌ Not subscribed - Click Re-subscribe first");
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("Error: " + error.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Check SW status on mount
    checkServiceWorkerStatus();

    // Auto subscribe on first load
    handleResubscribe();

    // Refresh subscription every 6 hours (to prevent expiration)
    const intervalId = setInterval(() => {
      console.log("🔄 Auto-refreshing subscription...");
      handleResubscribe();
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(intervalId);
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
      
      <div style={{ fontSize: "14px", marginBottom: "10px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "4px" }}>
        <div>Subscription Status: {subscriptionStatus}</div>
        <div>Service Worker Status: {swStatus}</div>
      </div>

      <button
        onClick={handleResubscribe}
        disabled={isLoading}
        style={{ 
          padding: "10px", 
          cursor: isLoading ? "not-allowed" : "pointer",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        {isLoading ? "Loading..." : "Re-subscribe to Push Notifications"}
      </button>

      <button
        onClick={handleTestNotification}
        disabled={isLoading}
        style={{ 
          padding: "10px", 
          cursor: isLoading ? "not-allowed" : "pointer",
          backgroundColor: "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        {isLoading ? "Loading..." : "Send Test Notification"}
      </button>

      <button
        onClick={handleUnregisterSW}
        disabled={isLoading}
        style={{ 
          padding: "10px", 
          cursor: isLoading ? "not-allowed" : "pointer",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        Unregister Service Worker (Debug)
      </button>

      <div style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
        <p><strong>Debug Tips:</strong></p>
        <ul>
          <li>Open DevTools (F12) → Application tab → Service Workers</li>
          <li>Check console for logs like "[Service Worker] Push event received"</li>
          <li>Make sure this tab is NOT focused when sending notification</li>
          <li>Check Windows Notification Center (right side of taskbar)</li>
        </ul>
      </div>
    </div>
  );
}
