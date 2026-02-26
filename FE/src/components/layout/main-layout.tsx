import { useEffect, useState, type ReactNode } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  FileText,
  FolderOpen,
  Upload,
  LogOut,
  Plus,
  Settings,
  Database,
  Settings2,
  Trash2,
  Earth,
  Lock,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { response, responseError } from "@/lib/utils/response";
import { storage, type BucketDataType } from "@/lib/utils/storage";
import { useAppProvider } from "../provider/provider-app/provider-app";
import { toaster } from "../ui/toaster";
import { useSession } from "../provider/provider-session";
import { id } from "date-fns/locale";
import { ConfirmDialog } from "../ui/confirm-dialog";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  const projectId = Cookies.get("project_id");
  const { pathname } = useLocation();
  const { logout } = useSession();

  const {
    useBucket: { bucketList, fetchListBucket, setSelectedBucket },
    usePagination: { setPage },
    useFolder: { setFolderId, setFolderLevel },
  } = useAppProvider();

  const [showDeleteBucket, setShowDeleteBucket] = useState<number | null>(null);

  const menuItems = bucketList.map((bucket) => ({
    id: bucket.id,
    title: bucket.name,
    url: `/${projectId}?bucket=${bucket.name}`,
    icon: FolderOpen,
    isPublic: bucket.public,
    active: location.search === `?bucket=${bucket.name}`,
  }));

  if (pathname === "/") {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar className="border-r-0 bg-gradient-to-b from-blue-600 via-blue-600 to-blue-700 w-64">
          <SidebarHeader className="border-b-0 px-6 py-6 bg-transparent">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Storage</h1>
                <p className="text-xs text-blue-100">Workspace</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="flex flex-col justify-between p-0 bg-transparent">
            <div className="space-y-2 px-3 py-6">
              {/* Create Bucket Button */}
              <div className=" py-2">
                <CreateBucketDialog onSuccess={fetchListBucket} />
              </div>

              <SidebarMenu className="gap-2">
                {menuItems.map((item) => (
                  <SidebarMenuItem
                    key={item.url}
                    className="relative flex items-center"
                    onMouseOver={() => {
                      setShowDeleteBucket(item.id);
                    }}
                    onMouseLeave={() => setShowDeleteBucket(null)}
                  >
                    <SidebarMenuButton
                      asChild
                      isActive={item.active}
                      className={`${
                        item.active
                          ? "data-[active=true]:bg-blue-700 data-[active=true]:text-white data-[active=true]:font-semibold rounded-xl h-11"
                          : "text-blue-50 hover:text-white hover:bg-white/15 rounded-xl h-11"
                      } transition-all duration-300 px-4 mb-1`}
                      onClick={() => {
                        setFolderId(undefined);
                        setFolderLevel(undefined);
                        setSelectedBucket(item.title);
                        setPage(1);
                      }}
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 w-full"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    <Button
                      className={cn(
                        "h-[unset] py-1 px-2 bg-blue-200 absolute right-2 duration-300 transition-all",
                        showDeleteBucket === item.id && "right-12",
                        !item.isPublic && "bg-yellow-200",
                      )}
                    >
                      {item.isPublic ? (
                        <Earth className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Lock className="w-4 h-4 text-yellow-600" />
                      )}
                    </Button>
                    {showDeleteBucket === item.id && (
                      <ConfirmDialog
                        variant="delete"
                        onConfirm={async () => {
                          try {
                            const { error } = await storage.deleteBucket(
                              item.title,
                            );
                            fetchListBucket();
                          } catch (error) {
                            return responseError(error, true);
                          }
                        }}
                      >
                        <Button className="h-[unset] py-1 px-2 bg-red-200 absolute right-2">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </ConfirmDialog>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </div>

            {/* Settings & Logout Buttons */}
            <div className="border-t border-white/10 p-4 space-y-3 bg-transparent">
              <div className="text-xs font-bold text-blue-100 uppercase tracking-wider px-3 mb-3">
                Options
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-blue-50 hover:bg-white/15 border-0 h-10 rounded-lg bg-transparent hover:text-white transition-all"
                asChild
              >
                <Link to={`/${projectId}/setting`}>
                  {/* <div className="w-2 h-2 bg-orange-400 rounded-full"></div> */}
                  <Settings2 className="w-4 h-4" />
                  <span className="text-sm">Setting</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-3 text-blue-50 hover:bg-red-50 border-0 h-10 rounded-lg bg-transparent hover:text-red-600 transition-all"
                onClick={logout}
              >
                {/* <div className="w-2 h-2 bg-blue-300 rounded-full"></div> */}
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="border-b bg-white px-6 py-4 flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex-1" />
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const CreateBucketDialog = ({ onSuccess }: { onSuccess?: () => any }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [bucketName, setBucketName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBucket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bucketName.trim()) {
      toaster({
        title: "Bucket name is required",
        condition: "warning",
        description: "Please enter a valid bucket name",
      });
      return;
    }

    setIsCreating(true);
    try {
      // Add API call to create bucket here
      const result = await storage.createBucket(bucketName, isPublic);
      if (onSuccess) await onSuccess();

      // alert("Bucket created successfully!");
      toaster({
        title: "Bucket created successfully",
        description: `Bucket "${bucketName}" has been created.`,
        condition: "success",
      });
      setBucketName("");
      setIsPublic(false);
      setIsCreateOpen(false);
      return response(result);
    } catch (error) {
      responseError(error, true);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start gap-3 bg-white/25 hover:bg-white/35 text-white border-0 font-medium rounded-xl h-11 px-4 backdrop-blur-md transition-all">
          <Plus className="h-5 w-5" />
          <span className="text-sm">Create Bucket</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Bucket</DialogTitle>
          <DialogDescription>
            Add a new storage bucket for your files
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateBucket} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bucket-name">Bucket Name</Label>
            <Input
              id="bucket-name"
              type="text"
              placeholder="e.g., documents, images"
              value={bucketName}
              onChange={(e) => setBucketName(e.target.value)}
              disabled={isCreating}
              className="focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 space-y-2">
            <Checkbox
              id="is-public"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked as boolean)}
              disabled={isCreating}
            />
            <Label htmlFor="is-public" className="cursor-pointer">
              Public Bucket
            </Label>
          </div>

          <p className="text-xs text-gray-500">
            Public buckets allow anyone to read files without authentication
          </p>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
