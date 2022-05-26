import React, { useMemo } from 'react';

function CursorIcon({ color }: { color: string }) {
    return useMemo(
        () => (
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill={color}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 0L20 7.14286L11.0948 11.1194L7.14286 20L0 0Z"
                />
            </svg>
        ),
        [color]
    );
}

export default CursorIcon;
