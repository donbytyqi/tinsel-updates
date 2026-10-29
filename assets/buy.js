// Paddle overlay checkout for every "Buy" link (href="#buy"). The client token is public by design: it can only open checkouts.
// tinselapp.com/#buy, the app's "Buy Tinsel…" button, opens the checkout straight away.
(() => {
  const PADDLE = { token: "live_82eefd8426be2a2a4b8f8dc8ced", priceId: "pri_01m640c3c3343t0jvrznsbhysw" };
  const links = [...document.querySelectorAll('a[href="#buy"]')];

  function open() {
    Paddle.Checkout.open({
      items: [{ priceId: PADDLE.priceId, quantity: 1 }],
      settings: { displayMode: "overlay", theme: "dark", allowLogout: true },
    });
  }

  try {
    Paddle.Initialize({
      token: PADDLE.token,
      eventCallback(e) {
        if (e.name === "checkout.completed") {
          const q = new URLSearchParams({ txn: e.data.transaction_id, email: e.data.customer?.email ?? "" });
          setTimeout(() => location.assign("/thanks?" + q), 1500); // let the overlay show its success state
        }
      },
    });
  } catch {
    return; // Paddle didn't load (blocked or offline): the links stay plain anchors.
  }
  links.forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); open(); }));
  if (location.hash === "#buy") { history.replaceState(null, "", location.pathname); open(); }
})();
