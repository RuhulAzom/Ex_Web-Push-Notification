import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
} from "date-fns";

interface DateDifference {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
}

export function calculateDateDifference(
  date1: string | Date | undefined,
  date2: string | Date | undefined
): DateDifference | null {
  if (!date1 || !date2) {
    return null;
  }

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return {
    years: differenceInYears(d2, d1),
    months: differenceInMonths(d2, d1) % 12,
    days: differenceInDays(d2, d1) % 30,
    hours: differenceInHours(d2, d1) % 24,
    minutes: differenceInMinutes(d2, d1) % 60,
    seconds: differenceInSeconds(d2, d1) % 60,
    totalDays: differenceInDays(d2, d1),
    totalHours: differenceInHours(d2, d1),
    totalMinutes: differenceInMinutes(d2, d1),
    totalSeconds: differenceInSeconds(d2, d1),
  };
}

export function formatDateDifference(
  date1: string | Date | undefined,
  date2: string | Date | undefined
): string {
  const diff = calculateDateDifference(date1, date2);

  if (!diff) {
    return "-";
  }

  const parts: string[] = [];

  if (diff.years > 0) parts.push(`${diff.years} tahun`);
  if (diff.months > 0) parts.push(`${diff.months} bulan`);
  if (diff.days > 0) parts.push(`${diff.days} hari`);
  if (diff.hours > 0 && parts.length === 0) parts.push(`${diff.hours} jam`);
  if (diff.minutes > 0 && parts.length === 0)
    parts.push(`${diff.minutes} menit`);
  if (diff.seconds > 0 && parts.length === 0)
    parts.push(`${diff.seconds} detik`);

  return parts.length > 0 ? parts.join(", ") : "0 detik";
}

export function formatDateRange(
  date1: string | Date | undefined,
  date2: string | Date | undefined
): string {
  if (!date1 || !date2) {
    return "-";
  }
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // daftar nama bulan Indonesia
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const day1 = d1.getDate();
  const month1 = months[d1.getMonth()];
  const year1 = d1.getFullYear();

  const day2 = d2.getDate();
  const month2 = months[d2.getMonth()];
  const year2 = d2.getFullYear();

  if (year1 === year2) {
    if (d1.getMonth() === d2.getMonth()) {
      return `${day1} - ${day2} ${month1} ${year1}`;
    } else {
      return `${day1} ${month1} - ${day2} ${month2} ${year1}`;
    }
  } else {
    return `${day1} ${month1} ${year1} - ${day2} ${month2} ${year2}`;
  }
}

export const getDate = (date: any) => {
  const Dates = new Date(date);
  const day = Dates.getDate();
  const month = Dates.getMonth() + 1;
  const year = Dates.getFullYear();
  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};
export const getHours = (date: any) => {
  const Dates = new Date(date);
  const hours = Dates.getHours();
  const minute = Dates.getMinutes();
  return `${hours < 10 ? `0${hours}` : hours}:${
    minute < 10 ? `0${minute}` : minute
  }`;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })}`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};
