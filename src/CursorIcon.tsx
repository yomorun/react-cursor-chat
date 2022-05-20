import React, { useMemo } from 'react';

function CursorIcon({ color }: { color: string }) {
    return useMemo(
        () => (
            <svg
                width="15"
                height="15"
                xmlns="http://www.w3.org/2000/svg"
                shapeRendering="geometricPrecision"
                fill={color}
            >
                <g>
                    <path
                        d="m0.78682,2.06437a1,1 0 0 1 1.27,-1.27l11.25,3.75a1,1 0 0 1 0,1.9l-4.68,1.56a1,1 0 0 0 -0.63,0.63l-1.56,4.68a1,1 0 0 1 -1.9,0l-3.75,-11.25z"
                        fill="#666"
                    />
                    <path
                        d="m2.28682,0.08437a1.75,1.75 0 0 0 -2.2,2.21l3.74,11.26a1.75,1.75 0 0 0 3.32,0l1.56,-4.68a0.25,0.25 0 0 1 0.16,-0.16l4.69,-1.55a1.75,1.75 0 0 0 0,-3.32l-11.27,-3.76z"
                        strokeWidth="1.5"
                        stroke="#fff"
                    />
                </g>
            </svg>
        ),
        [color]
    );
}

export default CursorIcon;
