import { getDate, getHours } from "@/lib/utils/date";
import { IconCheckList, IconPlus, IconWrong } from "@/styles/icon";
import { toast } from "sonner";
// import toast from "react-hot-toast";

interface ToasterProps {
  title: string;
  condition?: "success" | "warning";
  description?: string;
  duration?: number;
  noDate?: boolean;
}

export const toaster = ({
  title,
  condition,
  description,
  duration,
  noDate,
}: ToasterProps) => {
  toast.custom(
    (number) => (
      <Toasts
        number={parseInt(number.toString())}
        condition={condition}
        title={title}
        description={description}
        noDate={noDate ? noDate : false}
      />
    ),
    {
      position: "top-center",
      duration: duration ? duration : 1500,
      style: {
        padding: 0,
        margin: 0,
        boxShadow: "none",
        background: "transparent",
      },
    }
  );
  // toast(
  //   (data: any) => (
  //     <Toasts
  //       data={data}
  //       condition={condition}
  //       title={title}
  //       description={description}
  //       noDate={noDate ? noDate : false}
  //     />
  //   ),
  //   {
  //     duration: duration ? duration : 1500,
  //     style: {
  //       padding: 0,
  //       margin: 0,
  //       boxShadow: "none",
  //       background: "transparent",
  //     },
  //   }
  // );
};

export const Toasts = ({
  number,
  condition,
  title,
  description,
  noDate,
}: {
  number: number;
  condition?: any;
  title: string;
  description?: string;
  noDate: boolean;
}) => {
  const Dates = new Date();

  console.log({ number });

  return (
    <div
      id="toaster"
      className={`pointer-events-auto relative flex w-full max-w-md rounded-2xl bg-white shadow-[0_0_10px_#6f6a6a45]`}
    >
      <div className="flex flex-col p-4 text-[.9rem]">
        <div className="flex items-center">
          <div className="flex w-[30px] justify-start">
            {condition === "success" ? (
              <IconCheckList className={"text-green-600"} />
            ) : condition === "warning" ? (
              <IconWrong className={"text-red-600"} />
            ) : null}
            {!condition && <IconCheckList className={"text-green-600"} />}
          </div>
          <p className="font-medium">{title}</p>
        </div>
        <div className="ml-[30px] mt-[5px]">
          {description && <p className="text-[#6E717B]">{description}</p>}
          {!noDate && (
            <div className="font-normal mt-[.3rem] flex items-center gap-[.2rem] text-[.8rem] text-[#B6B9C3] duration-300">
              <p>{getHours(Dates)}</p>
              <span>.</span>
              <p>{getDate(Dates)}</p>
            </div>
          )}
        </div>
      </div>
      {}
      <div
        id="toasterClose"
        className="absolute right-[.5rem] top-[.5rem] w-fit rotate-45 rounded-[50%] p-[.4rem] duration-200 hover:bg-[#dadde7] active:bg-[#E8EBF4]"
        onClick={() => toast.dismiss(number)}
      >
        <IconPlus className={"text-[#6E717B]"} w={15} />
      </div>
    </div>
  );
};
