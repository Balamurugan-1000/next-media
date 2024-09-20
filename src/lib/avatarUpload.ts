// utils/avatarUpload.ts
import ky from "ky";

export const uploadGoogleAvatarToUploadThing = async (
  googleAvatarUrl: string,
) => {
  try {
    // Fetch the avatar image from the Google URL
    const avatarImageResponse = await ky.get(googleAvatarUrl);
    const avatarImageBuffer = await avatarImageResponse.arrayBuffer();

    // Create a form and append the fetched image as a blob
    const formData = new FormData();
    formData.append("file", new Blob([avatarImageBuffer]), "avatar.jpg");

    // Upload the avatar to UploadThing
    const response = await ky
      .post("https://uploadthing.com/api/upload", {
        body: formData,
        headers: {
          Authorization: "Bearer YOUR_UPLOADTHING_API_KEY", // Replace with your UploadThing API key
        },
      })
      .json<{ fileUrl: string }>();

    // Return the uploaded file URL
    return response.fileUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error("Failed to upload avatar.");
  }
};
