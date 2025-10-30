interface MaleIconProps {
    className?: string;
}

const MaleIcon = (props: MaleIconProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={128}
        height={128}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={props.className}
        {...props}
    >
        <path d="M16 3h5v5" />
        <path d="m21 3-6.75 6.75" />
        <circle cx="10" cy="14" r="6" />
    </svg>
);

export default MaleIcon;
