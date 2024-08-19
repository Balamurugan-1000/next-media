interface UserAvatarProps {
  avatarurl: string | null | undefined;
  size?: number;
  classname?: string;
}
import avatarPlaceholder from "@/assets/avatar-placeholder.png";
import { cn } from "@/lib/utils";

import Image from "next/image";
import React from "react";

const UserAvatar = ({ avatarurl, classname, size }: UserAvatarProps) => {
  return (
    <Image
      src={avatarurl || avatarPlaceholder}
      alt="User avatar"
      width={size || 48}
      height={size || 48}
      className={cn(
        "aspect-square h-fit flex-none rounded-full bg-secondary object-cover",
        classname,
      )}
    />
  );
};

export default UserAvatar;
