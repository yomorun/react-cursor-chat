import '@testing-library/jest-dom/extend-expect';
import { render, act, queryByAttribute } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import useRenderPosition from '../src/hooks/useRenderPosition';
import Me from '../src/cursor/me';

describe('unit test for custom hook useRenderPosition', () => {
    it('Render Hook', () => {
        const cursor = new Me({
            id: '001',
            x: 10,
            y: 10,
        });

        const { result } = renderHook(() => useRenderPosition(cursor));

        const refContainer = result.current;

        const dom = render(<div ref={refContainer}></div>);

        act(() => {
            cursor.onMove({
                mouseX: 50,
                mouseY: 50,
            });
        });

        const getByStyle = queryByAttribute.bind(null, 'style');

        const node = getByStyle(
            dom.container,
            'transform: translate3d(50px, 50px, 0);'
        );

        expect(node).not.toBe(null);
    });
});
