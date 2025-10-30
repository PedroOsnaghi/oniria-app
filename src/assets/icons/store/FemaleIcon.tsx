interface FemaleIconProps {
    className?: string;
}

const FemaleIcon = (props: FemaleIconProps) => (
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
        <path d="M12 15v7" />
        <path d="M9 19h6" />
        <circle cx="12" cy="9" r="6" />
    </svg>
);

export default FemaleIcon;
