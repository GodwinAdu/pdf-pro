import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000
    }${path}`
}


// Function to shuffle an array
// Function to shuffle an array
export const shuffleArray = (array: any[] = []) => {
  if (!Array.isArray(array)) {
    throw new Error("Input is not an array");
  }

  const shuffledArray = array.slice(); // Create a copy of the array

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

// Shuffle array function
export const shuffleOption = (array: any[]) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};


// ERROR HANDLER
export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};


export const calculateSubscriptionEndDate = (currentDate: string, subscriptionType: 'monthly' | '6-months' | 'yearly'): string => {
  const currentDateObj = new Date(currentDate);

  switch (subscriptionType) {
    case 'monthly':
      currentDateObj.setMonth(currentDateObj.getMonth() + 1)
      break;
    case '6-months':
      currentDateObj.setMonth(currentDateObj.getMonth() + 6)
      break;
    case 'yearly':
      currentDateObj.setFullYear(currentDateObj.getFullYear() + 1)
      break;
    default:
      return 'Invalid subscription type';
  }

  const endDate = currentDateObj.toISOString().slice(0, 10);

  return endDate;
}


export const getPrice = (selectedValue: string) => {
  switch (selectedValue) {
    case "Presentation(Docx)":
      return "Gh30";
    case "Presentation(powerpoint)":
      return "Gh40";
    case "Presentation(powerpoint with pictures)":
      return "Gh45";
    case "Research Assistance":
      return "Gh600";
    case "Nursing Care Study":
      return "Gh600";
    case "Thesis":
      return "Gh600";
    case "Homework Help":
      return "Gh15";
    case "Essay Writing":
      return "Gh25";
    case "English Writing":
      return "Gh30";
    case "Typing Support":
      return "Gh20";
    case "Essay Editing and Proofreading":
      return "Gh50";
    case "Subject Tutoring":
      return "Gh50";
    default:
      return "Unknown price";
  }
};


export const generateOtp = () => {
  return Math.floor(1000000 + Math.random() * 9000000).toString(); // 7-digit numeric OTP
};
export const generateReferral = () => {
  return Math.floor(100000 + Math.random() * 9000000).toString(); // 7-digit numeric OTP
};


export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const getAccessType = (userType: UserType) => {
  switch (userType) {
    case 'creator':
      return ['room:write'];
    case 'editor':
      return ['room:write'];
    case 'viewer':
      return ['room:read', 'room:presence:write'];
    default:
      return ['room:read', 'room:presence:write'];
  }
};

export const dateConverter = (timestamp: string): string => {
  const timestampNum = Math.round(new Date(timestamp).getTime() / 1000);
  const date: Date = new Date(timestampNum * 1000);
  const now: Date = new Date();

  const diff: number = now.getTime() - date.getTime();
  const diffInSeconds: number = diff / 1000;
  const diffInMinutes: number = diffInSeconds / 60;
  const diffInHours: number = diffInMinutes / 60;
  const diffInDays: number = diffInHours / 24;

  switch (true) {
    case diffInDays > 7:
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    case diffInDays >= 1 && diffInDays <= 7:
      return `${Math.floor(diffInDays)} days ago`;
    case diffInHours >= 1:
      return `${Math.floor(diffInHours)} hours ago`;
    case diffInMinutes >= 1:
      return `${Math.floor(diffInMinutes)} minutes ago`;
    default:
      return 'Just now';
  }
};

// Function to generate a random color in hex format, excluding specified colors
export function getRandomColor() {
  const avoidColors = ['#000000', '#FFFFFF', '#8B4513']; // Black, White, Brown in hex format

  let randomColor;
  do {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256); // Random number between 0-255
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB to hex format
    randomColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
  } while (avoidColors.includes(randomColor));

  return randomColor;
}

export const brightColors = [
  '#2E8B57', // Darker Neon Green
  '#FF6EB4', // Darker Neon Pink
  '#00CDCD', // Darker Cyan
  '#FF00FF', // Darker Neon Magenta
  '#FF007F', // Darker Bright Pink
  '#FFD700', // Darker Neon Yellow
  '#00CED1', // Darker Neon Mint Green
  '#FF1493', // Darker Neon Red
  '#00CED1', // Darker Bright Aqua
  '#FF7F50', // Darker Neon Coral
  '#9ACD32', // Darker Neon Lime
  '#FFA500', // Darker Neon Orange
  '#32CD32', // Darker Neon Chartreuse
  '#ADFF2F', // Darker Neon Yellow Green
  '#DB7093', // Darker Neon Fuchsia
  '#00FF7F', // Darker Spring Green
  '#FFD700', // Darker Electric Lime
  '#FF007F', // Darker Bright Magenta
  '#FF6347', // Darker Neon Vermilion
];

export function getUserColor(userId: string) {
  let sum = 0;
  for (let i = 0; i < userId.length; i++) {
    sum += userId.charCodeAt(i);
  }

  const colorIndex = sum % brightColors.length;
  return brightColors[colorIndex];
}



// created by chatgpt
export function isBase64Image(imageData: string) {
  const base64Regex = /^data:image\/(png|jpe?g|gif|webp);base64,/;
  return base64Regex.test(imageData);
}

// created by chatgpt
export function formatDateString(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString(undefined, options);

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${time} - ${formattedDate}`;
}

// created by chatgpt
export function formatThreadCount(count: number): string {
  if (count === 0) {
    return "No Threads";
  } else {
    const threadCount = count.toString().padStart(2, "0");
    const threadWord = count === 1 ? "Thread" : "Threads";
    return `${threadCount} ${threadWord}`;
  }
}
