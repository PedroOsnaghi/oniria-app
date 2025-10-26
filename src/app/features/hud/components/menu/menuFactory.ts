import type { TFunction } from "i18next";
import type { MenuFactory } from "../../types/menu.types";

const menuFactory = (t: TFunction): MenuFactory => ({
    portal: {
        title: t("node.menu.portal"),
        description: t("node.menu.descriptPortalPanel"),
        icon: undefined,
        items: [
            {
                label: t("node.menu.labelPortal"),
                icon: "dreamJournal",
                description: t("node.menu.oniriaAiFunction"),
                action: () => { }
            }, {
                label: t("node.menu.historialLabel"),
                icon: "nodeJournal",
                description: t("node.menu.historialDescription"),
                action: () => { }
            }
        ]
    },
    monitor: {
        title: t("node.menu.monitor.title"),
        description: t("node.menu.monitor.description"),
        icon: undefined,
        items: [
            {
                label: t("node.menu.monitor.items.labelPerfil"),
                icon: "user",
                description: t("node.menu.monitor.items.descPerfil"),
                action: () => { }
            }, {
                label: t("node.menu.monitor.items.labelNotificaciones"),
                icon: "bell",
                description: t("node.menu.monitor.items.descNotificaciones"),
                action: () => { }
            }, {
                label: t("node.menu.monitor.items.labelPersonalizacion"),
                icon: "palette",
                description: t("node.menu.monitor.items.descPersonalizacion"),
                action: () => { }
            }
        ]
    }
});

export default menuFactory;