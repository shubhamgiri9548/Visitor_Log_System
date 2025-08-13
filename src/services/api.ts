const BASE_URL = import.meta.env.VITE_API_URL;

export async function addVisitor(payload) {
  const res = await fetch(`${BASE_URL}/api/visitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to add visitor");
  }
  return res.json();
}

export async function getVisitorsByDate(date) {
  const res = await fetch(`${BASE_URL}/api/visitors?date=${date}`);
  if (!res.ok) {
    // Your backend returns 404 + {message:"No data..."} when empty
    if (res.status === 404) return [];
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to fetch visitors");
  }
  return res.json();
}



export async function markCheckout(id) {
  const res = await fetch(`${BASE_URL}/api/visitors/${id}/checkout`, {
    method: "PUT",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to set checkout");
  }
  return res.json();
}
