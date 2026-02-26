import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function LoadingPageWithText({
  heading,
  loading,
  percentage,
}: {
  heading?: string;
  loading: boolean;
  percentage?: number;
}) {
  return (
    <>
      {loading && (
        <div className="fixed left-0 top-0 z-[9999] flex h-full w-full select-none items-center justify-center bg-[#ffffff52] backdrop-blur-[6px]">
          <div className="flex flex-col items-center gap-[.5rem] text-center">
            <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
            {heading && percentage === undefined && (
              <p className="text-[1.3rem] text-[#464646]">{heading}</p>
            )}
            {percentage !== undefined && (
              <div className="w-64 mt-4">
                <Progress
                  value={percentage}
                  className="h-2 bg-gray-300"
                  classNameBar="bg-gray-600"
                />
                {heading && (
                  <p className="text-[1.3rem] text-[#464646] mt-2">{heading}</p>
                )}
                {!heading && (
                  <p className="text-[1.3rem] text-[#464646] mt-2">
                    {percentage.toFixed(1)}%
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// import { Loader2 } from "lucide-react";

// export default function LoadingPageWithText({
//   heading,
//   loading,
//   percentage,
// }: {
//   heading?: string;
//   loading: boolean;
//   percentage?: number;
// }) {
//   return (
//     <>
//       {loading && (
//         <div className="fixed left-0 top-0 z-[9999] flex h-full w-full select-none items-center justify-center bg-[#ffffff52] backdrop-blur-[6px]">
//           <div className="flex flex-col items-center gap-[.5rem] text-center">
//             <Loader2 className="h-16 w-16 animate-spin text-[#464646]" />
//             {heading && (
//               <p className="text-[1.3rem] text-[#464646]">{heading}</p>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
