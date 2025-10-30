import type { Meta, StoryObj } from "@storybook/react";
import HistoryPanel from "./HistoryPanel";

const meta: Meta<typeof HistoryPanel> = {
    title: "Features/HistoryPanel",
    component: HistoryPanel,
    decorators: [
        (Story) => (
            <div className="bg-gray-900 min-h-screen p-8 flex items-start justify-center">
                <Story />
            </div>
        ),
    ],
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HistoryPanel>;

export const Default: Story = {};

export const InHeader: Story = {
    decorators: [
        (Story) => (
            <div className="bg-gray-900 min-h-screen p-8 flex items-start justify-center">
                <Story />
            </div>
        ),
    ],
};
