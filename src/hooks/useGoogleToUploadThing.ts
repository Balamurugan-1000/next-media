import { useEffect, useState } from "react";
import ky from "ky"; // Or any HTTP client you prefer

const useUploadGoogleAvatar = (user: any) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uploadImageToUploadThing = async (imageBuffer: ArrayBuffer) => {
      try {
        const formData = new FormData();
        formData.append("file", new Blob([imageBuffer]), "avatar.jpg");

        const response = await ky
          .post("https://uploadthing.com/api/upload", {
            body: formData,
            headers: {
              Authorization: "Bearer YOUR_UPLOADTHING_API_KEY", // Replace with your actual UploadThing API key
            },
          })
          .json<{ fileUrl: string }>();

        return response.fileUrl;
      } catch (err) {
        setError("Failed to upload avatar.");
        console.error(err);
        return null;
      }
    };

    const fetchAndUploadAvatar = async () => {
      if (user?.avatar) {
        setUploading(true);
        try {
          // Fetch the avatar image from Google user profile
          const response = await ky.get(user.avatar);
          const imageBuffer = await response.arrayBuffer();

          // Upload the avatar to UploadThing
          const uploadedUrl = await uploadImageToUploadThing(imageBuffer);
          setAvatarUrl(uploadedUrl);
        } catch (err) {
          setError("Failed to fetch or upload avatar.");
          console.error(err);
        } finally {
          setUploading(false);
        }
      }
    };

    // Only attempt to fetch and upload if the user exists
    if (user) {
      fetchAndUploadAvatar();
    }
  }, [user]);

  return { avatarUrl, uploading, error };
};

export default useUploadGoogleAvatar;
