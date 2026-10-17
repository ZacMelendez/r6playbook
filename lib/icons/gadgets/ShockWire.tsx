export const ShockWire = ({
    fill = "white",
    ...props
}: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 76 68"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M22 11L20 0H15L13 11H22Z" fill={fill} />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 13H76V27H0V13ZM63 18H53V22H63V18ZM19 22V25H15V22H12V18H15V15H19V18H22V22H19Z"
                fill={fill}
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M71 31H5V68H71V31ZM49 34L30.451 45.0933L34.3333 52.3467L27 66L46.4118 54.48L41.2353 46.8L49 34Z"
                fill={fill}
            />
            <path d="M61 0L63 11H54L56 0H61Z" fill={fill} />
        </svg>
    );
};
