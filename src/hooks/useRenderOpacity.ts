import { RefObject, useEffect, useRef } from 'react';
import Other from '../cursor/other';

const useRenderOpacity = (cursor: Other, refContainer?: RefObject<HTMLDivElement>) => {
    const finaliRefContainer = refContainer || useRef<HTMLDivElement>(null);

    useEffect(() => {
        const renderOpacity = (opacity: number) => {
            if (finaliRefContainer.current) {
                finaliRefContainer.current.style.setProperty('opacity', String(opacity));
            }
        };

        cursor.onLeave = () => {renderOpacity(0.5)};
        cursor.onEnter = () => {renderOpacity(1)};
    }, [cursor]);

    return finaliRefContainer;
};

export default useRenderOpacity;
