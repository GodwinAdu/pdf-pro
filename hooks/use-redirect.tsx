import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Custom hook to handle redirection to login page with the origin path
const useRedirectToLogin = (user: boolean) => {
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            // Get the current path and redirect to login with the origin parameter
            const currentPath = window.location.pathname;
            router.push(`/login?origin=${encodeURIComponent(currentPath)}`);
        }
    }, [user, router]); // Run the effect when user changes
};

export default useRedirectToLogin;
