import NotificationButton from "@/app/features/notifications/components/NotificationButton";
import MobileMenuButton from "@/app/features/hud/components/topBar/MobileMenuButton";
import UserProfile from "@/app/features/profile/UserProfile";
import { useAuth } from "../../../auth/hooks/useAuth";
import UserLike from "@/app/features/like/UserLike";
import LanguageToggle from "@/app/features/lang-toggle/LanguageToggle";
import Wallet from "@/app/features/balance/Balance";
import { ThemeToggle } from "@/app/features/dark-mode";

type UserActionsProps = {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
};

export default function UserActions({
  onNotificationClick,
  //onProfileClick,
  onMenuClick,
}: UserActionsProps) {
  const { user, signOut } = useAuth();

  // const onClick = () => {
  //   if (onProfileClick) {
  //     onProfileClick();
  //   } else {
  //     signOut();
  //   }
  // };

  return (
    <div className="header-actions items-centeru gap-4">
      <ThemeToggle />
      <UserLike />
      <LanguageToggle />
      {/* <NotificationButton onClick={onNotificationClick} /> */}
      <Wallet/>
      <UserProfile
        name={user?.user_metadata.full_name ?? "Invitado"}
        email={user?.email ?? ""}
        onLogout={signOut}
      />
      <MobileMenuButton onClick={onMenuClick} />
    </div>
  );
}
