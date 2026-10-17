// All event instants are anchored to India Standard Time (+05:30), never the guest's clock zone.

export const couple = { one: "Aarav", two: "Anaya" };
export const weddingAt = new Date("2027-02-14T18:30:00+05:30");
export const venue = {
  name: "The Grand Pavilion",
  city: "Udaipur, Rajasthan",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Grand+Pavilion+Udaipur",
};

export const programme = [
  { name: "Mehendi", at: new Date("2027-02-12T16:00:00+05:30"), note: "Henna, marigolds & afternoon chai in the garden court" },
  { name: "Sangeet", at: new Date("2027-02-13T19:30:00+05:30"), note: "An evening of music and dance beneath the lanterns" },
  { name: "Wedding", at: weddingAt, note: "The pheras by the reflecting pool at dusk" },
  { name: "Reception", at: new Date("2027-02-15T20:00:00+05:30"), note: "Dinner and celebration in the marble hall" },
];

// Deterministic formatting (same on server and every browser), computed in IST (+05:30).
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const ist = (d: Date) => new Date(d.getTime() + 330 * 60000);
export const fmtDate = (d: Date) => {
  const x = ist(d);
  return `${DAYS[x.getUTCDay()]}, ${x.getUTCDate()} ${MONTHS[x.getUTCMonth()]} ${x.getUTCFullYear()}`;
};
export const fmtTime = (d: Date) => {
  const x = ist(d);
  const h = x.getUTCHours();
  return `${h % 12 || 12}:${String(x.getUTCMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"} IST`;
};

export function remaining(target: Date, now: number) {
  const ms = Math.max(0, target.getTime() - now);
  const s = Math.floor(ms / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}
