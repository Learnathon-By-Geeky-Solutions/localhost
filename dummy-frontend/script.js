// Function to subscribe the user to push notifications
async function subscribeUser(registration) {
  try {
    const vapidPublicKey =
      "BAmxkHMtYz0E48DyU0zNhKz_BLaXeeJHhBvAcUbI85EEEMvs7vf1KETZN7cQi0c4haFV0uTO5VjTlQoA0Z_DnIU"; // Replace with your VAPID public key
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    console.log("User subscribed:", subscription);

    // Send the subscription to server
    const response = await fetch(
      "http://localhost:5001/api/reminders/subscribe",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription, userId }),
      }
    );

    if (response.ok) {
      console.log("Subscription sent to server");
    } else {
      console.error("Failed to send subscription to server");
    }
  } catch (error) {
    console.error("Failed to subscribe the user:", error);
  }
}

// Register service worker and enable push notifications
if ("serviceWorker" in navigator && "PushManager" in window) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((registration) => {
      console.log("Service Worker registered:", registration);

      document
        .getElementById("enable-notifications")
        .addEventListener("click", () => {
          subscribeUser(registration);
        });
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
} else {
  console.warn("Push notifications are not supported in this browser.");
}

// Function to convert VAPID public key to Uint8Array
function urlBase64ToUint8Array(base64String) {
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
