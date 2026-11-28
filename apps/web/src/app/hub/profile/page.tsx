import ProfileForm from "@/components/hub/ProfileForm";
import { getMyProfile } from "@/lib/hub";

export default async function ProfilePage() {
  const profile = await getMyProfile();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold">My profile</h1>
      <ProfileForm initialProfile={profile} />
    </div>
  );
}
