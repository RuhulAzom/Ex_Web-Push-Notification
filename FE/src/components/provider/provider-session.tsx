import { env } from "@/env";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { responseError } from "@/lib/utils/response";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export type SessionType = {
  id: string;
  email: string;
};

const SESSION_COOKIE_KEY = "token";

export default function ProviderSession({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [session, setSession] = useState<SessionType | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const verifyToken = async () => {
    setIsSessionLoading(true);
    try {
      const res = await axios.get(`${env.STORAGE_URL}/auth/verify-token`, {
        headers: {
          Authorization: `Bearer ${Cookies.get(SESSION_COOKIE_KEY)}`,
        },
      });
      const resData = res.data.data;
      console.log("verify token response:", res.data);
      setSession({
        email: resData.email,
        id: resData.id,
      });
      setIsSessionLoading(false);
    } catch {
      // Cookies.remove(SESSION_COOKIE_KEY);
      navigate("/login");
      setIsSessionLoading(false);
    }
  };

  // Check session on mount
  useEffect(() => {
    const storedSession = Cookies.get(SESSION_COOKIE_KEY);
    if (storedSession) {
      verifyToken();
    } else {
      setIsSessionLoading(false);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (session && pathname === "/login") {
      navigate(-1);
    }
  }, [session, pathname]);

  // useEffect(() => {
  //   const public_key = Cookies.get("public_key");
  //   const private_key = Cookies.get("private_key");

  //   if (!public_key || !private_key) {
  //     logout();
  //   }
  // }, []);

  const logout = () => {
    // Cookies.remove(SESSION_COOKIE_KEY);
    setSession(null);
    // window.location.href = "/login";
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  console.log({ session });

  if (!session) {
    return <LoginPage />;
  }

  const Context = {
    session,
    logout,
  };
  return (
    <ProviderSessionContext.Provider value={Context}>
      {children}
    </ProviderSessionContext.Provider>
  );
}

export const useSession = () => {
  const context = React.useContext(ProviderSessionContext);
  if (!context) {
    throw new Error("useSession must be used within a ProviderApp");
  }
  return context;
};

const ProviderSessionContext = React.createContext<null | ProviderSessionType>(
  null
);

type ProviderSessionType = {
  session: SessionType | null;
  logout: () => void;
};

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (googleToken: any) => {
    setIsLoading(true);
    try {
      // Get Google token
      const { credential } = googleToken as { credential: string };
      console.log({ credential });
      const res = await axios.post(`${env.STORAGE_URL}/auth/login`, {
        token: credential,
      });
      console.log({ res });
      const resData = res.data.data;
      // const private_key = resData.keys.private_key;
      // const public_key = resData.keys.public_key;
      const token = resData.token;

      Cookies.set("token", token, {
        expires: 7,
      });
      // Cookies.set("private_key", private_key, {
      //   expires: 7,
      // });
      // Cookies.set("public_key", public_key, {
      //   expires: 7,
      // });

      console.log("Login Success: ", res);

      window.location.href = "/";
    } catch (error) {
      responseError(error, true);
      console.log({ error });
      setIsLoading(false);
      return;
    }
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setError(null);

  //   // Validation
  //   if (!email || !password) {
  //     setError("Email dan password harus diisi");
  //     return;
  //   }

  //   // if (!email.includes("@")) {
  //   //   setError("Email tidak valid");
  //   //   return;
  //   // }

  //   setIsLoading(true);

  //   try {
  //     console.log(`Listing buckets`);
  //     const res = await axios.post(`${env.STORAGE_URL}/auth/login`, {
  //       email,
  //       password,
  //     });

  //     const resData = res.data.data;
  //     const token = resData.token;
  //     const private_key = resData.keys.private_key;
  //     const public_key = resData.keys.public_key;

  //     console.log("login response:", res.data);

  //     Cookies.set("token", token, {
  //       expires: 7,
  //     });
  //     Cookies.set("private_key", private_key, {
  //       expires: 7,
  //     });
  //     Cookies.set("public_key", public_key, {
  //       expires: 7,
  //     });

  //     console.log({ token });

  //     window.location.href = "/";
  //   } catch (err: any) {
  //     const errorMessage = err?.response?.data?.message || err?.message;
  //     setError(errorMessage);
  //     return responseError(err, true);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  console.log({ VITE_GOOGLE_CLIENT_ID: env.VITE_GOOGLE_CLIENT_ID });

  return (
    <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 text-white rounded-lg p-3">
                <Lock className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Masukkan email dan password untuk mengakses aplikasi
            </CardDescription>
          </CardHeader>

          <CardContent className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={handleSubmit}
              onError={() => console.log("Login Failed")}
              text="signin_with"
              shape="circle"
              size="large"
              width="100%"
              theme="outline"
            />
            {/* <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="nama@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login"}
              </Button>
              <p className="text-xs text-gray-600 text-center">
                Gunakan akun Anda untuk login ke sistem
              </p>
            </form> */}
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
