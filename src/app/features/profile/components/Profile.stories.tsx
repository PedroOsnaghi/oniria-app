import type { Meta, StoryObj } from "@storybook/react";
import Profile from "./Profile";

const meta: Meta<typeof Profile> = {
    title: "Features/Profile",
    component: Profile,
    decorators: [
  (Story) => (
    <div className="flex items-center justify-center bg-[#0B041F] min-h-screen">
      <div
        className="relative w-[1000px] overflow-hidden border border-white/20 rounded-3xl shadow-[0_0_60px_rgba(167,85,247,0.4)]"
        style={{
          background: "linear-gradient(to bottom right, #2A1045, #10051F)",
          boxShadow:
            "0 0 100px rgba(167,85,247,0.2), inset 0 0 30px rgba(255,255,255,0.05)",
        }}
      >
        <div className="p-10">
          <Story />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/5 to-transparent pointer-events-none" />
      </div>
    </div>
  ),
],


    tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Profile>;

export const Default: Story = {};
