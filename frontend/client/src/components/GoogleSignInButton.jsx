import { useGoogleLogin } from "@react-oauth/google";

const GoogleSignInButton = () => {
  const handleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const userInfo = await res.json();
        console.log("User Info:", userInfo); // Logs email, name, picture, etc.

        // Now send the token to the backend
        const backendRes = await fetch("/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await backendRes.json();
        if (data.jwtToken) {
          localStorage.setItem("token", data.jwtToken);
          console.log("Login successful!");
        }
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    },
    onError: (error) => console.error("Google Sign-In Failed:", error),
  });

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "10px",
        backgroundColor: "#4285F4",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
