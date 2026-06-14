import PersonalInformation from "./PersonalInformation";
import ProfilePhoto from "./ProfilePhoto";
import UpdatePassword from "./UpdatePassword";

export default function MyAccount() {
  return (
    <section className="flex flex-col gap-6">
      <ProfilePhoto />
      <PersonalInformation />
      <UpdatePassword />
    </section>
  );
}
