
type SidebarHeaderProps = {
    title: string;
    description: string;
};

export default function SidebarHeader({ title, description }: SidebarHeaderProps) {
    return (
        <>
            <div className="text-[15px] font-semibold text-white/85 mt-5">
                {title}
            </div>
            <div className="text-[12px] text-white/50 mt-3">
                {description}
            </div>
        </>
    );
}