import "./styles/Header.css";
import HeaderLogo from "./HeaderLogo";
import HeaderActions from "@/app/features/users/actions/HeaderActions";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  logoText?: string;
  userName?: string;
  userEmail?: string;
  onLogoClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
};

export default function Header({
  logoText = "",
  userName = "",
  userEmail = "",
  onNotificationClick,
  onProfileClick,
  onMenuClick,
}: HeaderProps) {
  const navigate = useNavigate();

  const onLogoClick = () => {
    navigate("/home");
  };
  return (
    <header className="header container-header mx-auto">
      <HeaderLogo text={logoText} onClick={onLogoClick} />
      <HeaderActions
        userName={userName}
        userEmail={userEmail}
        onNotificationClick={onNotificationClick}
        onProfileClick={onProfileClick}
        onMenuClick={onMenuClick}
      />
    </header>
  );
}
