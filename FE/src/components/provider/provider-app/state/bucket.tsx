import { responseError } from "@/lib/utils/response";
import { storage, type BucketDataType } from "@/lib/utils/storage";
import { useEffect, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useSession } from "../../provider-session";
import Cookies from "js-cookie";

export const StateBucketApp = () => {
  // const { projectId } = useParams();
  const pathname = useLocation().pathname;
  const projectId = Cookies.get("project_id");
  const { logout } = useSession();
  const [searchParams] = useSearchParams();
  const bucket = searchParams.get("bucket");
  console.log({ bucket });
  const [selectedBucket, setSelectedBucket] = useState<null | string>(null);
  const [bucketList, setBucketList] = useState<BucketDataType[]>([]);
  const [bucketIsLoading, setBucketIsLoading] = useState<boolean>(true);

  const fetchListBucket = async () => {
    if (!projectId || pathname === "/") {
      setBucketIsLoading(false);
      return;
    }
    try {
      setBucketIsLoading(true);
      const { data } = await storage.listBuckets();
      if (data) {
        setBucketList(data);
      }
      setBucketIsLoading(false);
    } catch (error) {
      setBucketIsLoading(false);
      return responseError(error, true);
    }
  };

  useEffect(() => {
    fetchListBucket();
  }, [projectId]);

  useEffect(() => {
    if (selectedBucket === null) {
      if (bucket) {
        setSelectedBucket(bucket);
      } else if (bucketList.length > 0) {
        setSelectedBucket(bucketList[0].name);
      }
    }
  }, [bucket, bucketList, selectedBucket]);

  useEffect(() => {
    if (bucket) {
      setSelectedBucket(bucket);
    }
  }, [bucket]);

  return {
    bucketList,
    setBucketList,
    fetchListBucket,
    isLoading: bucketIsLoading,
    setIsLoading: setBucketIsLoading,
    selectedBucket,
    setSelectedBucket,
  };
};
