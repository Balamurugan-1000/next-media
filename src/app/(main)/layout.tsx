import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";
import MenuBar from "./MenuBar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await validateRequest();
  if (!session.user) redirect("/login");
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar classname="sticky top-[5.25rem] h-fit hidden sm:block space-y-3  rounded-2xl bg-card lg:p-5 shadow-sm" />
          {children}
        </div>
        <MenuBar classname="sticky bottom-0 w-full bg-card p-3 sm:hidden flex justify-center gap-5" />
      </div>
    </SessionProvider>
  );
};

export default Layout;
