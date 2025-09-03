export type PriceCalc = {
  baseNight: number;       // weekly base scraped/copied price per night (Airbnb)
  checkIn?: Date;          // optional chosen check-in; default: now
  now?: Date;              // testing
};

export function computeDirect({ baseNight, checkIn, now }: PriceCalc) {
  const today = now ?? new Date();
  const ci = checkIn ?? today;

  const DIRECT = 10; // always
  const daysAhead = Math.floor((ci.getTime() - today.getTime()) / (24*60*60*1000));
  const dow = ci.getDay(); // 0=Sun..6=Sat

  const sunThu = (dow >= 0 && dow <= 4);
  const within3 = (daysAhead >= 0 && daysAhead <= 3);
  const EXTRA = (sunThu && within3) ? 15 : 0;

  const pct = DIRECT + EXTRA;
  const final = round2(baseNight * (1 - pct/100));
  const savings = round2(baseNight - final);

  return { baseNight, directPct: DIRECT, extraPct: EXTRA, totalPct: pct, final, savings, sunThu, within3 };
}

function round2(n:number){ return Math.round(n); }