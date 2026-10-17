export const Electroclaw = ({
    fill = "white",
    ...props
}: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 82 85"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M48 0H34V35H48V0Z" fill={fill} />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M52.6216 37H26V76.25L23 81.5L30.4189 77H56V39.5L61 32L52.6216 37ZM53.5 39L32 52L36.5 60.5L28 76.5L50.5 63L44.5 54L53.5 39Z"
                fill={fill}
            />
            <path
                d="M75.0667 72L58 66V77L75.0667 79.0286L82 85L75.0667 72Z"
                fill={fill}
            />
            <path
                d="M24 66L6.93333 72L0 85L6.93333 79.0286L24 77V66Z"
                fill={fill}
            />
            <path d="M41.5 85L35.8708 79H47.1292L41.5 85Z" fill={fill} />
        </svg>
    );
};
