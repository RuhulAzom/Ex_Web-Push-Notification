import { useState } from "react";

export const StatePathFileApp = () => {
  const [listPath, setListPath] = useState<
    {
      name: string;
      id: number;
      level: number;
    }[]
  >([]);

  const currentPath =
    listPath.length > 0 ? listPath[listPath.length - 1] : null;

  return { listPath, setListPath, currentPath };
};
