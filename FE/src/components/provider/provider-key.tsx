import { env } from "@/env";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { responseError } from "@/lib/utils/response";
import { useSession } from "./provider-session";
import { Button } from "../ui/button";

export type SessionType = {
  id: string;
  email: string;
};

export default function ProviderKey({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const [searchParams] = useSearchParams();
  const firstLoad = searchParams.get("firstLoad");
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const verifyKey = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${env.STORAGE_URL}/project/get-project-key`,
        {
          projectId: parseInt(projectId!),
          userId: parseInt(session?.id!),
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        },
      );
      const resData = res.data.data;
      console.log({ resData });
      const private_key = resData.privateKey;
      const public_key = resData.publicKey;
      const project_id = resData.projectId;

      Cookies.set("private_key", private_key, {
        expires: 7,
      });
      Cookies.set("public_key", public_key, {
        expires: 7,
      });
      Cookies.set("project_id", project_id, {
        expires: 7,
      });
      console.log({ private_key, public_key });
      if (!private_key && !public_key) {
        setErr("You don't have access to this project.");
      }
      setIsLoading(false);
      if (firstLoad === "true") {
        // Hapus firstLoad query param
        window.history.replaceState(null, "", `/${project_id}`);
        window.location.pathname = `/${project_id}`;
      }
      return;
    } catch (error) {
      responseError(error, true);
      console.log({ error });
      setIsLoading(false);
      return;
    }
  };

  console.log({ params });

  // Check session on mount
  useEffect(() => {
    console.log("Checking session for ProviderKey...");
    console.log({ session });
    if (!projectId || !session) return;
    console.log("Verifying project keys...");
    verifyKey();
  }, [projectId, session, firstLoad]);

  if (projectId && isLoading) {
    return (
      <div className="fixed top-0 left-0 z-[100] w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="fixed top-0 left-0 z-[100] w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-6 border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="mx-auto mb-4 text-red-600" size={48} />
          <h2 className="text-2xl font-semibold text-red-700 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">{err}</p>
          <Link to={"/"} className="mt-6 block">
            <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
              Go Back
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
