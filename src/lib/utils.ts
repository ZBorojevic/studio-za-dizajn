import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("hr-HR", options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: false, 
  });

  return `${formattedDate} u ${time}`;
}

// 
export const multiFormatDateString = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case Math.floor(diffInDays) >= 30:
      return formatDateString(timestamp);
    case Math.floor(diffInDays) === 1:
      return "Prije 1 dan";
    case Math.floor(diffInDays) > 1 && diffInDays < 30:
      return `Prije ${Math.floor(diffInDays)} dana`;
    case Math.floor(diffInHours) === 1:
      return "Prije 1 sat";
    case Math.floor(diffInHours) === 2:
      return "Prije 2 sata";
    case Math.floor(diffInHours) === 3:
      return "Prije 3 sata";
    case Math.floor(diffInHours) === 4:
      return "Prije 4 sata";
    case Math.floor(diffInHours) >= 5 && Math.floor(diffInHours) < 24:
      return `Prije ${Math.floor(diffInHours)} sati`;
    case Math.floor(diffInMinutes) === 1:
      return "Prije 1 minutu";
    case Math.floor(diffInMinutes) === 2:
      return "Prije 2 minute";
    case Math.floor(diffInMinutes) === 3:
      return "Prije 3 minute";
    case Math.floor(diffInMinutes) === 4:
      return "Prije 4 minute";
    case Math.floor(diffInMinutes) >= 5 && Math.floor(diffInMinutes) < 60:
      return `Prije ${Math.floor(diffInMinutes)} minuta`;
    default:
      return "Upravo sada";
  }
};

export const formatPostTimestamp = (timestamp: string = ""): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInHours: number = diff / (1000 * 60 * 60);

  if (diffInHours >= 72) {
    // If the post is older than 72 hours, use formatDateString
    return formatDateString(timestamp);
  } else {
    // If the post is less than 24 hours old, use multiFormatDateString
    return multiFormatDateString(timestamp);
  }
};


export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};