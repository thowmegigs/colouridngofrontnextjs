import type { Metadata } from "next"
import ProfileEditPage from "./profile-edit-page"

export const metadata: Metadata = {
  title: "Edit Profile | Colour Indigo",
  description: "Update your profile information",
}

export default function ProfilePage() {
  return <ProfileEditPage />
}
