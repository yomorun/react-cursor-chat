import { RefObject, useEffect, useRef } from 'react';
import Other from '../cursor/other';
import Me from '../cursor/me';
import { MousePosition } from '../types';

const useRenderPosition = (cursor: Me | Other, refContainer?: RefObject<HTMLDivElement>) => {
    const finaliRefContainer = refContainer || useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderPosition = (position: MousePosition) => {
            if (finaliRefContainer.current) {
                finaliRefContainer.current.style.setProperty('transform', `translate3d(${position.mouseX}px, ${position.mouseY}px, 0)`);
            }
        };

        renderPosition({ mouseX: cursor.x, mouseY: cursor.y });

        cursor.onMove = (position: MousePosition) => {
            renderPosition(position);
        };
    }, [cursor]);

    return finaliRefContainer;
};

export default useRenderPosition;
