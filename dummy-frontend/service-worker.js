self.addEventListener("push", (event) => {
  const payload = event.data ? event.data.text() : "No payload";
  const data = JSON.parse(payload);

  const title = data.title;
  const options = {
    body: data.body,
    icon: "/icon.png", // Add an icon if needed
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
