import type { Meta, StoryObj } from "@storybook/react";
import { HistoryCard } from "./HistoryCard";

const meta: Meta<typeof HistoryCard> = {
    title: "Features/HistoryCard",
    component: HistoryCard,
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
type Story = StoryObj<typeof HistoryCard>;

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
