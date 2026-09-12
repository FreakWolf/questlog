import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

export function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}

export function serverError(message = "Something went wrong") {
  return NextResponse.json({ error: message }, { status: 500 });
}
