import { type ClassValue, clsx } from "clsx"
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
