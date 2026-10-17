export const NitroCell = ({
    fill = "white",
    ...props
}: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            viewBox="0 0 32 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M19 1H4C1.79086 1 0 2.79089 0 5V14H7V12C7 7.58167 10.5817 4 15 4H17C17.6906 4 18.3607 4.08752 19 4.25208V1Z"
                fill={fill}
            />
            <path
                d="M24 8.12402C24.6372 9.27222 25 10.5938 25 12V14H32V5C32 2.79089 30.2091 1 28 1H24V8.12402Z"
                fill={fill}
            />
            <path d="M0 16H7V33H0V16Z" fill={fill} />
            <path d="M25 16V33H32V16H25Z" fill={fill} />
            <path
                d="M7 42V35H0V44C0 46.2091 1.79086 48 4 48H28C30.2091 48 32 46.2091 32 44V35H25V42C25 43.1046 24.1046 44 23 44H9C7.89542 44 7 43.1046 7 42Z"
                fill={fill}
            />
            <path
                d="M8 12C8 8.13401 11.134 5 15 5H17C20.866 5 24 8.13401 24 12V42C24 42.5523 23.5523 43 23 43H9C8.44772 43 8 42.5523 8 42V12Z"
                fill={fill}
            />
            <path d="M20 0H23V12H20V0Z" fill={fill} />
        </svg>
    );
};
