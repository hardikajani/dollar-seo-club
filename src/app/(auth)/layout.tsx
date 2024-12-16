import { redirect } from "next/navigation";
import React from "react";
import { currentUser } from "@clerk/nextjs/server";


type Props = {
    children: React.ReactNode;
};

const Layout = async ({ children }: Props) => {
    const user = await currentUser();

    if (user) redirect("/");

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden">
            <div className="isolate flex w-full justify-center">
                {children}
            </div>
        </div>
    );
};

export default Layout;