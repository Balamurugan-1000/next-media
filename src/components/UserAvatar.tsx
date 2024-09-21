import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserAvatarProps {
  avatarurl: string | null | undefined;
  size?: number;
  className?: string;
}

export default function UserAvatar({
  avatarurl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <Image
      src={avatarurl || avatarPlaceholder}
      alt="User avatar"
      width={size ?? 48}
      height={size ?? 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full border-[1px] border-primary bg-secondary object-cover",
        className,
      )}
    />
  );
}
