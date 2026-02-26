import { useSession } from "@/components/provider/provider-session";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  Users,
  Mail,
  Trash2,
  Plus,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { set } from "date-fns";
import axios from "axios";
import { response, responseError } from "@/lib/utils/response";
import { env } from "@/env";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

type CollaboratorType = "OWNER" | "EDITOR" | "VIEWER";

interface Collaborator {
  email: string;
  type: CollaboratorType;
}

const PRIVATE_KEY = Cookies.get("private_key");
const PUBLIC_KEY = Cookies.get("public_key");

export default function SettingPage() {
  const { session } = useSession();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);

  const fetchCollaborator = async () => {
    try {
      const res = await axios.get(
        `${env.STORAGE_URL}/project/get-project-collaborator`,
        {
          headers: {
            Authorization: `Bearer ${PUBLIC_KEY}`,
          },
        }
      );

      const resData = res.data.data;
      setCollaborators(resData);
      console.log({ resData });
    } catch (error) {
      return responseError(error, true);
    }
  };

  useEffect(() => {
    fetchCollaborator();
  }, []);

  const getCollaboratorBadgeVariant = (type: CollaboratorType) => {
    switch (type) {
      case "OWNER":
        return "bg-blue-600 text-white";
      case "EDITOR":
        return "bg-purple-600 text-white";
      case "VIEWER":
        return "bg-gray-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="container max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-blue-600/70 mt-2 font-medium">
            Manage your account and API keys
          </p>
        </div>

        {/* Account Information */}
        <Card className="border border-blue-100 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <CardTitle className="text-blue-900">Account Information</CardTitle>
            <CardDescription className="text-blue-600/70">
              Your account details and authentication credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold text-blue-900">
                Email
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={session?.email || ""}
                  disabled
                  className="flex-1 bg-blue-50 border border-blue-200 text-gray-700"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(session?.email || "", "email")}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  {copiedField === "email" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              </div>
            </div>

            {/* User ID */}
            <div className="space-y-2">
              <Label htmlFor="user-id" className="font-semibold text-blue-900">
                User ID
              </Label>
              <div className="flex gap-2">
                <Input
                  id="user-id"
                  type="text"
                  value={session?.id || ""}
                  disabled
                  className="flex-1 bg-blue-50 border border-blue-200 text-gray-700"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    handleCopy(session?.id?.toString() || "", "userId")
                  }
                  className="border-blue-200 hover:bg-blue-50"
                >
                  {copiedField === "userId" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="border border-blue-100 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <CardTitle className="text-blue-900">API Keys</CardTitle>
            <CardDescription className="text-blue-600/70">
              Use these keys to authenticate API requests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Public Key */}
            <div className="space-y-2">
              <Label
                htmlFor="public-key"
                className="font-semibold text-blue-900"
              >
                Public Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="public-key"
                  type="text"
                  value={PUBLIC_KEY || ""}
                  disabled
                  className="flex-1 bg-blue-50 border border-blue-200 font-mono text-sm text-gray-700"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(PUBLIC_KEY || "", "publicKey")}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  {copiedField === "publicKey" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-blue-600/60 font-medium">
                ✓ Use this key for read-only operations
              </p>
            </div>

            {/* Private Key */}
            <div className="space-y-2">
              <Label
                htmlFor="private-key"
                className="font-semibold text-blue-900"
              >
                Private Key
              </Label>
              <div className="flex gap-2">
                <Input
                  id="private-key"
                  type={showPrivateKey ? "text" : "password"}
                  value={PRIVATE_KEY || ""}
                  disabled
                  className="flex-1 bg-blue-50 border border-blue-200 font-mono text-sm text-gray-700"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  {showPrivateKey ? (
                    <EyeOff className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Eye className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopy(PRIVATE_KEY || "", "privateKey")}
                  className="border-blue-200 hover:bg-blue-50"
                >
                  {copiedField === "privateKey" ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-blue-600" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-blue-600/60 font-medium">
                🔒 Keep this key secure. It allows full access to your storage.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Collaborators */}
        <Card className="border border-blue-100 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <div className="">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaborators
              </CardTitle>
              <CardDescription className="text-blue-600/70">
                People with access to this project
              </CardDescription>
            </div>
            <AddCollaboratorDialog onSuccess={fetchCollaborator} />
          </CardHeader>
          <CardContent className="pt-6">
            {collaborators.length > 0 ? (
              <div className="space-y-3">
                {collaborators.map((collaborator, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {collaborator.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={getCollaboratorBadgeVariant(
                          collaborator.type
                        )}
                      >
                        {collaborator.type}
                      </Badge>
                      {collaborator.type !== "OWNER" &&
                        collaborator.email !== session?.email && (
                          <ConfirmDialog
                            variant="delete"
                            onConfirm={async () => {
                              try {
                                const res = await axios.delete(
                                  `${env.STORAGE_URL}/project/delete-collaborator`,
                                  {
                                    data: { email: collaborator.email },
                                    headers: {
                                      Authorization: `Bearer ${PRIVATE_KEY}`,
                                    },
                                  }
                                );
                                await fetchCollaborator();
                                return response(res, true);
                              } catch (error) {
                                return responseError(error, true);
                              }
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </ConfirmDialog>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No collaborators yet. Share your project to invite
                collaborators.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Security Warning */}
        <Card className="border border-blue-200 bg-blue-50 shadow-md">
          <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200">
            <CardTitle className="text-blue-900">🛡️ Security Warning</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 font-medium leading-relaxed">
              Never share your private key with anyone. Treat it like a
              password. If compromised, unauthorized users can access and modify
              your storage. Always keep it confidential!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const AddCollaboratorDialog = ({
  onSuccess,
}: {
  onSuccess: () => Promise<any>;
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [type, setType] = useState<CollaboratorType>("VIEWER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsAdding(true);
      const res = await axios.post(
        `${env.STORAGE_URL}/project/create-collaborator`,
        {
          email,
          type,
        },
        {
          headers: {
            Authorization: `Bearer ${PRIVATE_KEY}`,
          },
        }
      );

      await onSuccess();
      setIsAdding(false);
      setIsOpen(false);
      setEmail("");
      setType("VIEWER");

      return response(res, true);
    } catch (error) {
      setIsAdding(false);
      return responseError(error, true);
    }
  };

  return (
    <Dialog open={isAdding ? true : isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Collaborator
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Collaborator</DialogTitle>
          <DialogDescription>
            Invite someone to collaborate on this project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-semibold">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="collaborator@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus:ring-blue-500"
              disabled={isAdding}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role" className="font-semibold">
              Role
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as CollaboratorType)}
              disabled={isAdding}
            >
              <SelectTrigger className="focus:ring-blue-500">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNER">Owner</SelectItem>
                <SelectItem value="EDITOR">Editor</SelectItem>
                <SelectItem value="VIEWER">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Collaborator"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
