import { NextResponse } from "next/server";

export async function proxy(request) {
  if (process.env.NODE_ENV !== "production") {
    return NextResponse.next();
  }

  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    extractFirstIp(request.headers.get("x-forwarded-for")) ||
    request.ip;

  if (!ip || isPrivateIp(ip)) {
    return deny();
  }

  try {
    // Get ASN info from ipapi.co
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "User-Agent": "NextProxy/1.0" },
    });
    if (!res.ok) return deny();

    const data = await res.json();

    // console.log("IPAPI ASN:", data.asn, "Org:", data.org);

    // Cloudflare and Rogers
    const allowedASNs = ["AS13335", "13335", "AS812", "812"];
    if (!allowedASNs.includes(data.asn)) {
      return deny();
    }

    return NextResponse.next();
  } catch (err) {
    console.error("ASN check failed:", err);
    return deny();
  }
}

function deny() {
  return new NextResponse(
    "We’re not live in your region yet, but stay tuned for future availability.",
    { status: 403 }
  );
}

function extractFirstIp(xff) {
  if (!xff) return null;
  const first = xff.split(",")[0]?.trim();
  return first || null;
}

function isPrivateIp(ip) {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.")
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
