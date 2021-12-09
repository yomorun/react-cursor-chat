import '@testing-library/jest-dom/extend-expect';
import { act, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import useOnlineCursor from '../src/hooks/useOnlineCursor';
import 'whatwg-fetch';

describe('unit test for custom hook useOnlineCursor', () => {
    it('Render Hook', async () => {
        let current: any = {
            me: {
                name: '',
            },
            others: []
        };
        await act(async () => {
            const { result } = renderHook(() =>
                useOnlineCursor({
                    socketURL: 'wss://ws-dev.yomo.run',
                    name: '001',
                })
            );

            await new Promise(resolve => {
                setTimeout(resolve, 2000);
            });

            current = result.current;
        });

        const { me } = current;

        expect(me.name).toBe('001');

        act(() => {
            fireEvent.mouseMove(document, {
                clientX: 120,
                clientY: 123,
            });
        });

        expect(me.x).toBe(120);
        expect(me.y).toBe(123);
    });
});
