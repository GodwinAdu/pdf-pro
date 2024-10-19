import { ModalProvider } from "@/components/group-discussion/providers/modal-provider";
import React from "react";



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main >
            <ModalProvider />
            {children}
        </main>
    );
}