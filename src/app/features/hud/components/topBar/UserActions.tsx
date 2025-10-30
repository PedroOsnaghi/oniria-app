import NotificationButton from "@/app/features/notifications/components/NotificationButton";
import MobileMenuButton from "@/app/features/hud/components/topBar/MobileMenuButton";
import UserWidget from "@/app/features/user-widget/UserWidget";
import { useAuth } from "../../../auth/hooks/useAuth";
import UserLike from "../../../like/UserLike";
import LanguageToggle from "../../../lang-toggle/LanguageToggle";
import { ThemeToggle } from "@/app/features/dark-mode";

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
    <div className="header-actions items-centeru gap-4">
      <ThemeToggle />
      <UserLike />
      <LanguageToggle />
      <NotificationButton onClick={onNotificationClick} />
      <UserWidget
        name={user?.user_metadata.full_name ?? "Invitado"}
        email={user?.email ?? ""}
        onClick={onClick}
      />
      <MobileMenuButton onClick={onMenuClick} />
    </div>
  );
}
