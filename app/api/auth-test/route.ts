import { syncAuthUser } from "../../../lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const user = await syncAuthUser(req);
  if (!user) {
    return NextResponse.json({ ok: false, message: "Not signed in" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user });
}