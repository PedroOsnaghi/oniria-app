import type { ComponentType, SVGProps } from "react";
import PortalIcon from "./store/PortalIcon";
import BadgeIcon from "./store/BadgeIcon";
import BellIcon from "./store/BellIcon";
import ChevronDownIcon from "./store/ChevronDownIcon";
import ChevronRightIcon from "./store/ChevronRightIcon";
import ClockIcon from "./store/ClockIcon";
import CloseIcon from "./store/CloseIcon";
import MenuIcon from "./store/MenuIcon";
import QuoteIcon from "./store/QuoteIcon";
import RefreshIcon from "./store/RefreshIcon";
import SaveIcon from "./store/SaveIcon";
import SettingsIcon from "./store/SettingsIcon";
import SparklesIcon from "./store/SparklesIcon";
import UserIcon from "./store/UserIcon";
import DreamJournal from './store/DreamJournal';
import NodeJournal from './store/NodeJournal';
import MagicIcon from './store/MagicIcon';
import UnLike from "./store/UnLike";
import CheckIcon from "./store/CheckIcon";
import SpinnerIcon from "./store/SpinnerIcon";
import ImageIcon from "./store/ImageIcon";
import DownloadIcon from "./store/DownloadIcon";
import PaletteIcon from "./store/PaletteIcon";
import SunIcon from "./store/SunIcon";
import MoonIcon from "./store/MoonIcon";
import EyeOpenIcon from "./store/EyeOpenIcon";
import EyeCloseIcon from "./store/EyeCloseIcon";
import ArrowIcon from "./store/ArrowIcon";
import MicIcon from "./store/MicIcon";
import CoinsIcon from "./store/CoinsIcon";

export type IconName =
    | "portal"
    | "badge"
    | "bell"
    | "chevron-down"
    | "chevron-right"
    | "clock"
    | "close"
    | "menu"
    | "quote"
    | "refresh"
    | "save"
    | "settings"
    | "sparkles"
    | "user"
    | "dreamJournal"
    | "nodeJournal"
    | "magic"
    | "unLike"
    | "check"
    | "spinner"
    | "image"
    | "download"
    | "palette"
    | "sun"
    | "moon"
    | "eye-open"
    | "eye-close"
    | "arrow"
    | "mic"
    | "coins"
    ;

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export const iconsStore: Record<IconName, IconComponent> = {
    portal: PortalIcon,
    badge: BadgeIcon,
    bell: BellIcon,
    "chevron-down": ChevronDownIcon,
    "chevron-right": ChevronRightIcon,
    clock: ClockIcon,
    close: CloseIcon,
    menu: MenuIcon,
    quote: QuoteIcon,
    refresh: RefreshIcon,
    save: SaveIcon,
    settings: SettingsIcon,
    sparkles: SparklesIcon,
    user: UserIcon,
    dreamJournal: DreamJournal,
    nodeJournal: NodeJournal,
    magic: MagicIcon,
    unLike: UnLike,
    check: CheckIcon,
    spinner: SpinnerIcon,
    image: ImageIcon,
    download: DownloadIcon,
    palette: PaletteIcon,
    sun: SunIcon,
    moon: MoonIcon,
    "eye-open": EyeOpenIcon,
    "eye-close": EyeCloseIcon,
    arrow: ArrowIcon,
    mic: MicIcon,
    coins: CoinsIcon,
};
