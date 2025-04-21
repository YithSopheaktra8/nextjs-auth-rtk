import { serialize } from "cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
	const body = await req.json();
	const { username, password } = body;

	// Make a POST request to the Our API
	const response = await fetch(
		`http://localhost:8080/api/v1/auth/login`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username, password }),
		}
	);

	// If the request fails, return an error message to the client-side
	if (!response.ok) {
		return NextResponse.json(
			{
				message: "Failed to login",
			},
			{
				status: response.status,
			}
		);
	}
	// If the request is successful, parse the response body to get the data
	
	const data = await response.json();
	const accessToken = data?.accessToken || null;
	const refreshToken = data?.refreshToken || null;

	// Serialize the refresh token and set it as a cookie with
	// (httpOnly, secure, path, and sameSite options) in the response headers to the client-side
	const cookieName = "refresh";
	const serialized = serialize(cookieName, refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		sameSite: "lax", // or "strict" or "none"
	});

	// Return the access token and user data to the client-side
	// with the serialized refresh token as a cookie
	return NextResponse.json(
		{
			accessToken: accessToken,
		},
        {
            headers: {
                "Set-Cookie": serialized,
            },
        }
	);
}