import NotificationButton from "@/assets/icons/store/NotificationButton";
import MobileMenuButton from "@/app/features/hud/components/header/MobileMenuButton";
import UserProfile from "@/app/features/hud/components/header/UserProfile";
import { useAuth } from "../../../auth/hooks/useAuth";
import UserLike from "./UserLike";
import LanguageToggle from "./toggle/LanguageToggle";

type UserActionsProps = {
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
};

export default function UserActions({
  onNotificationClick,
  onProfileClick,
  onMenuClick,
}: UserActionsProps) {
  const { user, signOut } = useAuth();

  const onClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      signOut();
    }
  };

  return (
    <div className="header-actions items-centeru">
      <LanguageToggle />
      <UserLike />
      <NotificationButton onClick={onNotificationClick} />
      <UserProfile
        name={user?.user_metadata.full_name ?? "Invitado"}
        email={user?.email ?? ""}
        onClick={onClick}
      />
      <MobileMenuButton onClick={onMenuClick} />
    </div>
  );
}
