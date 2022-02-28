import { useEffect, useRef } from 'react';
import Others from '../cursor/others';
import Me from '../cursor/me';
import { MousePosition } from '../types';

const useRenderPosition = (cursor: Me | Others) => {
    const refContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderPosition = (position: MousePosition) => {
            if (refContainer.current) {
                refContainer.current.setAttribute(
                    'style',
                    `transform: translate3d(${position.mouseX}px, ${position.mouseY}px, 0);`
                );
            }
        };

        renderPosition({ mouseX: cursor.x, mouseY: cursor.y });

        cursor.onMove = (position: MousePosition) => {
            renderPosition(position);
        };
    }, [cursor]);

    return refContainer;
};

export default useRenderPosition;
