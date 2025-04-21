import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const cookies = request.cookies;
    const refreshToken = cookies.get("refresh");

    // If the user is not logged in and tries to access a protected page, redirect to login
    if (!refreshToken && request.nextUrl.pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url).toString());
    }

    // If the user is logged in and tries to access the login page, redirect to the home page
    if (refreshToken && request.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/", request.url).toString());
    }
}

// Apply middleware to specific routes
export const config = {
    matcher: [
        "/", // Home page
        "/login", // Login page
    ],
};