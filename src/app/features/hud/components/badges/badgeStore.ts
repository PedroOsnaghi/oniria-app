import { useTranslation } from "react-i18next";

export type BadgeData = {
    name: string;
    title: string;
    icon: string;
    description: string;
    xOffset: number;
    yOffset: number;
    zOffset: number;
};

export function useObjectsDescriptions() {
    const { t } = useTranslation();
    return [
        {
            name: "portal",
            title: t("node.menu.portal"),
            icon: "portal",
            description:
                t("node.menu.descriptionPortal"),
            xOffset: 1.5,
            yOffset: 0.1,
            zOffset: 0,
        },
        {
            name: "monitor",
            title: t("node.menu.monitor.title"),
            icon: "settings",
            description:
                t("node.menu.monitor.description"),
            xOffset: 0,
            yOffset: 0.2,
            zOffset: 1.5,
        }
    ];
}