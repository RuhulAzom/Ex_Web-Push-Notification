import express from "express";
import webpush from "web-push";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json()); // ← TAMBAH INI untuk parse request body

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

const vapidKeys = {
  publicKey: publicVapidKey,
  privateKey: privateVapidKey,
};

webpush.setVapidDetails(
  "mailto:test@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

let subscriptions = [];

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  console.log("Subscription received:", subscription);

  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "Invalid subscription data" });
  }

  subscriptions.push(subscription);
  console.log(`Total subscriptions: ${subscriptions.length}`);

  res.status(201).json({ status: "success", message: "Subscription saved" });
});

app.post("/send-notification", (req, res) => {
  if (subscriptions.length === 0) {
    return res
      .status(400)
      .json({ error: "No subscriptions available. Please subscribe first." });
  }

  const notificationPayload = {
    title: "New Notification",
    body: "This is a new notification",
    icon: "https://some-image-url.jpg",
    data: {
      url: "https://example.com",
    },
  };

  console.log(
    `Sending notification to ${subscriptions.length} subscription(s)`,
  );

  Promise.allSettled(
    subscriptions.map((subscription, index) =>
      webpush
        .sendNotification(
          subscription,
          JSON.stringify(notificationPayload),
        )
        .catch((err) => {
          // Handle 410 (subscription expired) and 404 (not found)
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.warn(
              `Subscription ${index} expired/not found (${err.statusCode}). Removing...`,
            );
            subscriptions.splice(index, 1);
          }
          throw err;
        }),
    ),
  )
    .then((results) => {
      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      console.log(
        `Notifications: ${successful} sent, ${failed} failed`,
      );

      if (successful > 0) {
        res.status(200).json({
          message: "Notification sent successfully.",
          successful,
          failed,
        });
      } else {
        res.status(500).json({
          error: "Failed to send notification to all subscribers",
          successful,
          failed,
        });
      }
    })
    .catch((err) => {
      console.error("Error sending notification", err);
      res
        .status(500)
        .json({ error: "Failed to send notification", details: err.message });
    });
});

// Endpoint untuk cek subscriptions
app.get("/subscriptions", (req, res) => {
  res.json({
    count: subscriptions.length,
    subscriptions: subscriptions.map((sub) => ({
      endpoint: sub.endpoint?.substring(0, 50) + "...",
      keys: sub.keys,
    })),
  });
});

// Endpoint untuk clear subscriptions (untuk testing)
app.delete("/subscriptions", (req, res) => {
  subscriptions = [];
  res.json({ message: "All subscriptions cleared" });
});

// Endpoint untuk validate subscription
app.post("/validate-subscription", (req, res) => {
  const subscription = req.body;
  
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ valid: false, error: "Invalid subscription" });
  }

  // Check if subscription exists in our list
  const exists = subscriptions.some((sub) => sub.endpoint === subscription.endpoint);
  res.json({ valid: exists });
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});

// const express = require("express");
// const webpush = require("web-push");
// const bodyParser = require("body-parser");
// const path = require("path");

// const app = express();

// // Set static path
// app.use(express.static(path.join(__dirname, "client")));

// app.use(bodyParser.json());

// const publicVapidKey =
//   "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
// const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

// webpush.setVapidDetails(
//   "mailto:test@test.com",
//   publicVapidKey,
//   privateVapidKey,
// );

// // Subscribe Route
// app.post("/subscribe", (req, res) => {
//   // Get pushSubscription object
//   const subscription = req.body;

//   console.log("Subscription received:", subscription);

//   // Send 201 - resource created
//   res.status(201).json({ message: "Subscription successful" });

//   // Create payload
//   const payload = JSON.stringify({
//     title: "Push Test",
//     body: "This is a test notification from your server!",
//     icon: "http://image.ibb.co/frYOFd/tmlogo.png",
//   });

//   console.log("Sending notification with payload:", payload);

//   // Pass object into sendNotification
//   webpush
//     .sendNotification(subscription, payload)
//     .then(() => console.log("Notification sent successfully!"))
//     .catch((err) => console.error("Error sending notification:", err));
// });

// const port = 5000;

// app.listen(port, () => console.log(`Server started on port ${port}`));
