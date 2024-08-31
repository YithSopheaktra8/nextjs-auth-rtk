"use client";

export default function page() {
    const handleLogin = async () => {
        const res = await fetch("http://localhost:3000/api/auth/oauth", {
            method: "GET",
            credentials: "include",
        });

        if (res.ok) {
            await fetch("http://localhost:3000/api/auth/callback");
        }

        return (
            <div className="h-screen w-full justify-center items-center">
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                >
                    Loginasdasd
                </button>
            </div>
        );
    };
}
