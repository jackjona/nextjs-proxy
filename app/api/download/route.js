import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  if (!fileUrl)
    return NextResponse.json({ error: "Missing file URL" }, { status: 400 });

  try {
    const parsed = new URL(fileUrl);
    const allowedHosts = ["pixeldrain.com", "pixeldra.in"];
    const isAllowed = allowedHosts.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    );
    if (!isAllowed)
      return NextResponse.json(
        { error: "Domain not allowed" },
        { status: 403 }
      );

    const res = await fetch(fileUrl, { redirect: "follow" });
    if (!res.ok)
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: res.status }
      );

    const buffer = await res.arrayBuffer();

    let filename = parsed.pathname.split("/").pop() || "downloaded-file";
    const cd = res.headers.get("content-disposition");
    if (cd) {
      const match = cd.match(/filename="?([^"]+)"?/);
      if (match) filename = match[1];
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          res.headers.get("content-type") || "application/octet-stream",
        "Content-Length":
          res.headers.get("content-length") || buffer.byteLength.toString(),
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Proxy error" }, { status: 500 });
  }
}
