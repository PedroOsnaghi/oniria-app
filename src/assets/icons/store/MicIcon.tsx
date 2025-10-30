import React from "react";

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            fill="currentColor"
            d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a.75.75 0 0 1 1.5 0 6.002 6.002 0 0 1-5.25 5.95V19.5h1.75a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5H11.25v-2.55A6.002 6.002 0 0 1 6 11a.75.75 0 0 1 1.5 0 4.5 4.5 0 0 0 9 0Z"
        />
    </svg>
);

export default MicIcon;
