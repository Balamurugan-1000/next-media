"use client";

import { Button } from "@/components/ui/button";
import { UserData } from "@/lib/types";
import { useState } from "react";
import EditProfileDialog from "./EditProfileDialog";

interface EditProfileProps {
  user: UserData;
}

const EditProfileButton = ({ user }: EditProfileProps) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        className="hover:text-primary"
        onClick={() => setShowDialog(true)}
      >
        Edit Profile
      </Button>

      <EditProfileDialog
        user={user}
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </>
  );
};

export default EditProfileButton;
