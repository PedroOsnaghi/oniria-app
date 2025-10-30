import ChevronDownIcon from "@/assets/icons/store/ChevronDownIcon";
import UserIcon from "@/assets/icons/store/UserIcon";

type UserProfileProps = {
  name: string;
  email: string;
  onClick?: () => void;
};

export default function UserWidget({
  name,
  email,
  onClick,
}: UserProfileProps) {
  return (
    <div
      onClick={onClick}
      className="hidden md:flex h-full bg-gray-700/45 hover:bg-[var(--user-hover-bg)] items-center gap-2 rounded-full px-3 py-1.5 border border-[var(--user-border)] hover:border-[var(--user-hover-border)] transition-all duration-200 ease-out cursor-pointer backdrop-blur-2xl"
    >
      <div className="h-7 w-7 rounded-full grid place-items-center bg-[var(--user-icon-bg)] hover:bg-[var(--user-icon-hover-bg)] transition-colors duration-200">
        <UserIcon className="transition-colors duration-200" />
      </div>

      <div className="leading-tight">
        <div
          className="text-xs font-semibold transition-colors duration-200"
          style={{ color: "var(--user-text-primary)" }}
        >
          {name}
        </div>
        <div
          className="text-[10px] transition-colors duration-200"
          style={{ color: "var(--user-text-muted)" }}
        >
          {email}
        </div>
      </div>

      <ChevronDownIcon className="transition-colors duration-200 opacity-70" />
    </div>
  );
}
