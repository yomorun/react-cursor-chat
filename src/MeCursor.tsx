import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Me from './cursor/me';
import CursorIcon from './CursorIcon';
import Latency from './Latency';
import useRenderPosition from './hooks/useRenderPosition';

const MeCursor = ({
    cursor,
    showLatency,
}: {
    cursor: Me;
    showLatency: boolean;
}) => {
    const refContainer = useRenderPosition(cursor);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const onChangeInput = useCallback(e => {
        const inputValue = e.target.value;
        if (inputValue === '/') {
            return;
        }
        setInputValue(inputValue);
        cursor.sendMessage(inputValue);
    }, []);

    useEffect(() => {
        const keydown = (e: KeyboardEvent) => {
            if (e.code === 'Slash') {
                setShowInput(true);
                setInputValue(
                    cursor.name && !cursor.avatar ? cursor.name + ': ' : ''
                );
            }

            if (e.code === 'Escape') {
                setShowInput(false);
                setInputValue('');
                cursor.sendMessage('');
            }
        };

        document.addEventListener('keydown', keydown);

        return () => {
            document.removeEventListener('keydown', keydown);
        };
    }, []);

    return useMemo(
        () => (
            <div className="online-cursor-wrapper__cursor" ref={refContainer}>
                <CursorIcon color={cursor.color} />
                <Latency cursor={cursor} showLatency={showLatency} />
                {cursor.avatar ? (
                    <img
                        className="online-cursor-wrapper__avatar"
                        src={cursor.avatar}
                        alt="avatar"
                    />
                ) : cursor.name && !cursor.avatar && !showInput ? (
                    <span className="online-cursor-wrapper__name">
                        {cursor.name}
                    </span>
                ) : null}
                {showInput && (
                    <div className="online-cursor-wrapper__input-box">
                        <span>{inputValue}</span>
                        <input
                            autoFocus
                            placeholder="Say something"
                            value={inputValue}
                            onChange={onChangeInput}
                            style={{
                                paddingLeft:
                                    cursor.name && !cursor.avatar && showInput
                                        ? 10
                                        : 42,
                            }}
                        />
                    </div>
                )}
            </div>
        ),
        [showInput, inputValue, showLatency]
    );
};

export default MeCursor;
