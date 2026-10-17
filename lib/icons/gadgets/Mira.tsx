export const Mira = ({
    fill = "white",
    ...props
}: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 80 35"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M0 0H80V32H53V29H77V3H3V29H27V32H0V0Z" fill={fill} />
            <path d="M42.5 5L22.5 29H9L28 5H42.5Z" fill={fill} />
            <path d="M42 26H33L50 5H59L42 26Z" fill={fill} />
            <path d="M66 5H70L53 26H49L66 5Z" fill={fill} />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M51 27H29V35H51V27ZM49 29H31V33H49V29Z"
                fill={fill}
            />
        </svg>
    );
};
