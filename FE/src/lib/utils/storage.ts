'use client';
import axios from "axios";
import { responseError, throwError } from "./response";
import Cookies from "js-cookie";

import io, { Socket } from 'socket.io-client';
import { useSession } from '@/components/provider/provider-session';
import { env } from '@/env';
import { useCallback, useEffect, useRef, useState } from 'react';
import { se } from "date-fns/locale";

// ======================================================



const PRIVATE_KEY = Cookies.get("private_key");
const PUBLIC_KEY = Cookies.get("public_key");

const UPLOAD_URL = env.STORAGE_UPLOAD_URL;

export const storage = {
  from: (bucket: string) => {
    return {
      upload: async (filePath: string, file: File) => {
        const loadingId = crypto.randomUUID().slice(0, 6)

        if (socket) {
          socket.emit(`join:loading`, { loadingId })
        }
        console.log(`Uploading file to bucket: ${bucket}`);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", filePath);
        console.log({ UPLOAD_URL });
        const res = await axios.post(
          `${UPLOAD_URL}/storage/buckets/${bucket}/files`,
          formData,
          {
            params: {
              loadingId
            },
            headers: {
              Authorization: `Bearer ${PUBLIC_KEY}`,
            },
            timeout: 6000000, // 100 menit dalam milliseconds
          }
        );

        console.log("Upload response:", res.data);
        if (socket) {
          socket.emit(`leave:loading`, { loadingId })
        }
        return { data: res.data, error: null };
      },
      remove: async (filePathArray: string[]) => {
        console.log(`Removing files from bucket: ${bucket}`);
        const res = await axios.delete(
          `${env.STORAGE_URL}/storage/buckets/${bucket}/files`,
          {
            data: { pathArray: filePathArray },
            headers: {
              Authorization: `Bearer ${PUBLIC_KEY}`,
            },
          }
        );

        console.log("Upload response:", res.data);
        return { data: res.data, error: null };
      },
      download: async (filePath: string) => {
        console.log(`Uploading file to bucket: ${bucket}`);
        const res = await axios.post(
          `${env.STORAGE_URL}/storage/buckets/${bucket}/files/download`,
          {
            filepath: filePath,
          },
          {
            headers: {
              Authorization: `Bearer ${PUBLIC_KEY}`,
            },
            responseType: "blob",
          }
        );
        // Extract filename dari Content-Disposition header atau dari filePath
        const contentDisposition = res.headers["content-disposition"];
        let filename = "download";

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="(.+?)"/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        } else {
          // Fallback: ambil dari filePath
          filename = filePath.split("/").pop() || "download";
        }

        // Create blob URL dan trigger download otomatis
        const url = window.URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        console.log("Download completed:", filename);

        console.log("Download response:", res.data);
        return { data: res.data, error: null };
      },
      listFiles: async (
        { page, take }: { page: number; take: number },
        folderId?: number,
        folderLevel?: number
      ) => {
        const res = await axios.get(
          `${env.STORAGE_URL}/storage/buckets/${bucket}/files`,
          {
            params: {
              folderId,
              folderLevel,
              page,
              take,
            },
            headers: {
              Authorization: `Bearer ${PUBLIC_KEY}`,
            },
          }
        );

        console.log("list files response:", res.data);

        return {
          data: {
            files: res.data.data.files as ListDataType[],
            folders: res.data.data.folders as {
              name: string;
              id: number;
              level: number;
            }[],
            page: res.data.page as number,
            take: res.data.take as number,
            totalPages: res.data.total_pages as number,
            totalData: res.data.total_data as number,
          },
          error: null,
        };
      },
    };
  },
  createBucket: async (name: string, isPublic: boolean) => {
    console.log(`Creating bucket: ${name}, public: ${isPublic}`);
    const res = await axios.post(
      `${env.STORAGE_URL}/storage/buckets`,
      {
        name,
        public: isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_KEY}`,
        },
      }
    );

    console.log("create bucket response:", res.data);

    return { data: res.data.data as BucketDataType, error: null };
  },
  deleteBucket: async (name: string) => {
    console.log(`Deleting bucket: ${name}`);
    const res = await axios.delete(
      `${env.STORAGE_URL}/storage/buckets/${name}`,
      {
        headers: {
          Authorization: `Bearer ${PRIVATE_KEY}`,
        },
      }
    );

    console.log("create bucket response:", res.data);

    return { data: res.data.data as BucketDataType, error: null };
  },
  listBuckets: async () => {
    console.log(`Listing buckets`);
    const res = await axios.get(`${env.STORAGE_URL}/storage/buckets`, {
      headers: {
        Authorization: `Bearer ${PUBLIC_KEY}`,
      },
    });

    console.log("list buckets response:", res.data);
    return { data: res.data.data as BucketDataType[], error: null };
  },
};

export type ListDataType = {
  id: number;
  folderId: number | null;
  bucketId: number;
  userId: number;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
  publicUrl: string;
  createdAt: string;
};
export type BucketDataType = {
  id: number;
  userId: number;
  name: string;
  public: boolean;
  createdAt: string;
};

export type BucketFolderType = {
  id: number;
  name: string;
  level: number;
};


// ======================================================


let socket: Socket | null = null;

const serverUrl = UPLOAD_URL;

export const connectSocket = () => {
  if (!socket) {
    socket = io(serverUrl, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });


    socket.on('connect', () => {
      console.log('Connected to socket server:', socket?.id);
      console.log("✅ Joined notification:reminder room");
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


export const useSocket = (serverUrl?: string) => {
  const { session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const listenersRef = useRef<Map<string, (data: any) => void>>(new Map());

  useEffect(() => {
    // ✅ Hanya connect jika session ada
    if (!session?.id) {
      disconnectSocket();
      setIsConnected(false);
      setSocketId(null);
      return;
    }

    const socket = connectSocket();

    socket.on('connect', () => {
      setIsConnected(true);
      setSocketId(socket.id || null);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setSocketId(null);
    });

    // // ✅ Auto authenticate saat connect
    // socket.emit('user:auth', { userId: session.user.id });
    // console.log('[AUTH] Authenticated as:', session.user.id);

    // Re-attach listeners yang sudah terdaftar
    listenersRef.current.forEach((callback, eventName) => {
      socket.on(eventName, callback);
    });

    return () => {
      // Cleanup: remove listeners saat unmount
      listenersRef.current.forEach((callback, eventName) => {
        socket.off(eventName, callback);
      });
    };
  }, [session?.id, serverUrl]);

  const on = useCallback((eventName: string, callback: (data: any) => void) => {
    const socket = getSocket();
    if (socket) {
      listenersRef.current.set(eventName, callback);
      socket.on(eventName, callback);
    }
  }, []);

  const off = useCallback((eventName: string) => {
    const socket = getSocket();
    const callback = listenersRef.current.get(eventName);
    if (socket && callback) {
      socket.off(eventName, callback);
      listenersRef.current.delete(eventName);
    }
  }, []);

  const emit = useCallback(
    (eventName: string, data?: any) => {
      const socket = getSocket();
      if (socket && isConnected) {
        socket.emit(eventName, data);
      }
    },
    [isConnected],
  );

  const disconnect = useCallback(() => {
    disconnectSocket();
    listenersRef.current.clear();
  }, []);

  if (isConnected) {
    console.log('useSocket:', { isConnected, socketId });
  }

  return {
    isConnected,
    socketId,
    on,
    off,
    emit,
    // authenticate,
    disconnect,
  };
};
