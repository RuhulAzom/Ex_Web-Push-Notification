import { Loader2 } from "lucide-react";

export default function LoadingPageWithText({
  text,
  isLoading,
}: {
  text?: string;
  isLoading: boolean;
}) {
  return (
    <>
      {isLoading && (
        <div className="fixed left-0 top-0 z-[201] flex h-full w-full select-none items-center justify-center bg-[#ffffff52] backdrop-blur-[6px]">
          <div className="flex flex-col items-center gap-[.5rem] text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
            {text && <p className="text-[1.3rem] text-[#464646]">{text}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export function LoadingComponentWithText({ text }: { text?: string }) {
  return (
    <div className="flex w-full select-none items-center justify-center h-[75vh]">
      <div className="flex flex-col items-center gap-[.5rem] text-center">
        <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
        <p className="text-[1.3rem] text-[#464646]">
          {text ? text : "Loading"}
        </p>
      </div>
    </div>
  );
}
