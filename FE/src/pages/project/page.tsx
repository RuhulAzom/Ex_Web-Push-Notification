import { useEffect, useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FolderOpen,
  Users,
  Settings,
  ExternalLink,
  Plus,
  Lock,
  Eye,
} from "lucide-react";
import { toaster } from "@/components/ui/toaster";
import { storage } from "@/lib/utils/storage";
import { response, responseError } from "@/lib/utils/response";
import axios from "axios";
import { env } from "@/env";
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
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

type ProjectType = "OWNER" | "EDITOR" | "VIEWER";

interface Project {
  id: string;
  name: string;
  type: ProjectType;
  files_count: number;
}

const dummy = [
  { id: "1", name: "Project Alpha", type: "OWNER" },
  { id: "2", name: "Project Beta", type: "EDITOR" },
  { id: "3", name: "Project Gamma", type: "VIEWER" },
  { id: "4", name: "Project Delta", type: "OWNER" },
  { id: "5", name: "Project Epsilon", type: "EDITOR" },
  { id: "6", name: "Project Zeta", type: "VIEWER" },
];

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  const getTypeConfig = (type: ProjectType) => {
    switch (type) {
      case "OWNER":
        return {
          label: "Owner",
          color: "bg-blue-600 text-white",
          icon: Lock,
          description: "Full access and control",
        };
      case "EDITOR":
        return {
          label: "Editor",
          color: "bg-purple-600 text-white",
          icon: Settings,
          description: "Can edit content",
        };
      case "VIEWER":
        return {
          label: "Viewer",
          color: "bg-gray-600 text-white",
          icon: Eye,
          description: "View only",
        };
      default:
        return {
          label: "Owner",
          color: "bg-blue-600 text-white",
          icon: Lock,
          description: "Full access",
        };
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const token = Cookies.get("token");
      const res = await axios.get(
        `${env.STORAGE_URL}/project/get-project-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({ res });
      const resData = res.data.data;
      console.log({ resData });
      setProjects(resData);
      setIsLoading(false);
      return;
    } catch (error) {
      responseError(error, true);
      console.log({ error });
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <FolderOpen className="w-8 h-8" />
                Projects
              </h1>
              <p className="text-blue-100 text-lg">
                Manage and access all your projects in one place
              </p>
            </div>
            <CreateProjectDialog>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg gap-2 h-12 px-6">
                <Plus className="w-5 h-5" />
                New Project
              </Button>
            </CreateProjectDialog>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const config = getTypeConfig(project.type);
          const IconComponent = config.icon;

          return (
            <Card
              key={project.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 bg-white"
            >
              {/* Type Badge Header */}
              <div
                className={`h-2 bg-gradient-to-r ${
                  project.type === "OWNER"
                    ? "from-blue-500 to-blue-600"
                    : project.type === "EDITOR"
                    ? "from-purple-500 to-purple-600"
                    : "from-gray-500 to-gray-600"
                }`}
              />

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl ${config.color} shadow-md group-hover:shadow-lg transition-all`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <Badge className={`${config.color} px-3 py-1`}>
                    {config.label}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500">{config.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats or Info */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Members</p>
                    <p className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-1 mt-1">
                      <Users className="w-4 h-4 text-blue-600" />3
                    </p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">Files</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {project.files_count}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Link to={`/${project.id}?firstLoad=true`} className="w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg h-10"
                    >
                      Open
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State Message - Optional */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first project to get started
          </p>
          <CreateProjectDialog>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Plus className="w-4 h-4" />
              Create Project
            </Button>
          </CreateProjectDialog>
        </div>
      )}
    </div>
  );
}

const CreateProjectDialog = ({
  children,
  onSuccess,
}: {
  onSuccess?: () => any;
  children: ReactNode;
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectName.trim()) {
      toaster({
        title: "Project name is required",
        condition: "warning",
        description: "Please enter a valid project name",
      });
      return;
    }

    setIsCreating(true);
    try {
      const token = Cookies.get("token");
      const res = await axios.post(
        `${env.STORAGE_URL}/project/create-project`,
        {
          name: projectName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log({ res });
      const resData = res.data.data;
      if (onSuccess) await onSuccess();

      toaster({
        title: "Project created successfully",
        condition: "success",
        description: `Project "${resData.name}" has been created.`,
      });
      setProjectName("");
      setIsCreateOpen(false);
      return response(res);
    } catch (error) {
      responseError(error, true);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add a new project to your workspace
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateProject} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              type="text"
              placeholder="e.g., Document Management, Image Gallery"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isCreating}
              className="focus:ring-blue-500"
            />
          </div>

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
