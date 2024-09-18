import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  classname?: string;
}

const MenuBar = ({ classname }: MenuBarProps) => {
  return (
    <div className={classname}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Home"
        asChild
      >
        <Link href={"/"}>
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Notifications"
        asChild
      >
        <Link href={"/notifications"}>
          <Bell />
          <span className="hidden lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Messages"
        asChild
      >
        <Link href={"/messages"}>
          <Mail />
          <span className="hidden lg:inline">Messages</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Bookmarks"
        asChild
      >
        <Link href={"/bookmarks"} className="hover:text-primary">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
