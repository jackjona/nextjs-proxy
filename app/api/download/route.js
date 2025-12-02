import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing file URL" }, { status: 400 });
  }

  const parsed = new URL(url);
  if (
    !["pixeldrain.com", "pixeldra.in"].some(
      (h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`)
    )
  ) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: res.status }
    );
  }

  return new NextResponse(res.body, {
    status: res.status,
    headers: {
      "Content-Type":
        res.headers.get("content-type") || "application/octet-stream",
      "Content-Disposition":
        res.headers.get("content-disposition") ||
        `attachment; filename="${parsed.pathname.split("/").pop()}"`,
    },
  });
}
