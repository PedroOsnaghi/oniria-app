import type { Meta, StoryObj } from "@storybook/react";
import Balance from "./Balance";

const meta: Meta<typeof Balance> = {
    title: "Features/Balance",
    component: Balance,
    decorators: [
        (Story) => (
            <div
                className="p-8 flex items-center justify-center min-h-screen"
                style={
                    {
                        backgroundColor: "#210911",
                        "--user-text-primary": "#fff",
                    } as React.CSSProperties
                }
            >
                <Story />
            </div>
        ),
    ],
    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Balance>;

export const Default: Story = {
    args: {
        balance: 1234.56,
    },
};

export const InHeader: Story = {
    decorators: [
        (Story) => (
            <header
                className="backdrop-blur-2xl p-4 flex items-center gap-4"
                style={{
                    backgroundColor: "rgba(33, 9, 17, 0.95)",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
            >
                <Story />
            </header>
        ),
    ],
    args: {
        balance: 789.0,
    },
};
