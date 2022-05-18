import '@testing-library/jest-dom/extend-expect';
import { render, act, getByTestId } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import useRenderOpacity from '../src/hooks/useRenderOpacity';
import Other from '../src/cursor/other';

describe('unit test for custom hook useRenderOpacity', () => {
    const TEST_ID = '001'
    it('Render Hook', () => {
        const cursor = new Other({
            id: TEST_ID,
            x: 10,
            y: 10,
        });

        const { result } = renderHook(() => useRenderOpacity(cursor));

        const refContainer = result.current;

        const dom = render(<div data-testid={TEST_ID} ref={refContainer}></div>);

        act(() => {
            cursor.onLeave();
        });

        const el = getByTestId(dom.container, TEST_ID)

        expect(el.style.opacity).toEqual('0.5')

        expect(el).not.toBe(null);
    });
});
