import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import useOnlineCursor from './hooks/useOnlineCursor';
import useRenderPosition from './hooks/useRenderPosition';
import useLatency from './hooks/useLatency';
import Me from './cursor/me';
import Others from './cursor/others';
import './styles/cursor-chat.less';

const MeCursor = ({
    cursor,
    showLatency,
    theme,
}: {
    cursor: Me;
    showLatency: boolean;
    theme?: 'light' | 'dark';
}) => {
    const refContainer = useRenderPosition(cursor);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const latencyData = useLatency(cursor, showLatency);

    const onKeydown = useCallback(e => {
        if (e.code === 'Slash') {
            setShowInput(true);
        }

        if (e.code === 'Escape') {
            setShowInput(false);
            setInputValue('');
            cursor.sendMessage('');
        }
    }, []);

    const onChangeInput = useCallback(e => {
        const inputValue = e.target.value;
        if (inputValue === '/') {
            return;
        }
        setInputValue(inputValue);
        cursor.sendMessage(inputValue);
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', onKeydown);

        return () => {
            document.removeEventListener('keydown', onKeydown);
        };
    }, []);

    return useMemo(
        () => (
            <div className="online-cursor-wrapper__cursor" ref={refContainer}>
                <CursorIcon color={cursor.color} />
                {latencyData.latency > 0 && (
                    <div className="online-cursor-wrapper__latency">
                        📍 {latencyData.meshId}{' '}
                        <span
                            style={{
                                backgroundColor: latencyData.backgroundColor,
                            }}
                        >
                            {latencyData.latency}ms
                        </span>
                    </div>
                )}
                {cursor.avatar && (
                    <img
                        className="online-cursor-wrapper__avatar"
                        src={cursor.avatar}
                        alt="avatar"
                    />
                )}
                {showInput && (
                    <div
                        className={`online-cursor-wrapper__input-box ${
                            theme === 'light' ? 'light' : 'dark'
                        }`}
                    >
                        <span>{inputValue}</span>
                        <input
                            autoFocus
                            placeholder="Say something"
                            value={inputValue}
                            onChange={onChangeInput}
                        />
                    </div>
                )}
            </div>
        ),
        [showInput, inputValue, latencyData]
    );
};

const OthersCursor = ({
    cursor,
    showLatency,
    theme,
}: {
    cursor: Others;
    showLatency: boolean;
    theme?: 'light' | 'dark';
}) => {
    const refContainer = useRenderPosition(cursor);
    const [msg, setMsg] = useState(cursor.name);
    const latencyData = useLatency(cursor, showLatency);

    useEffect(() => {
        cursor.onTextMessage = (msg: string) => {
            setMsg(msg);
        };
    }, []);

    return useMemo(
        () => (
            <div className="online-cursor-wrapper__cursor" ref={refContainer}>
                <CursorIcon color={cursor.color} />
                {latencyData.latency > 0 && (
                    <div className="online-cursor-wrapper__latency">
                        📍 {latencyData.meshId}{' '}
                        <span
                            style={{
                                backgroundColor: latencyData.backgroundColor,
                            }}
                        >
                            {latencyData.latency}ms
                        </span>
                    </div>
                )}
                {cursor.avatar && (
                    <img
                        className="online-cursor-wrapper__avatar"
                        src={cursor.avatar}
                        alt="avatar"
                    />
                )}
                {msg && (
                    <div
                        className={`online-cursor-wrapper__text ${
                            theme === 'light' ? 'light' : 'dark'
                        }`}
                    >
                        {msg}
                    </div>
                )}
            </div>
        ),
        [msg, latencyData]
    );
};

const CursorChat = ({
    presenceURL,
    presenceAuth,
    room,
    showLatency = false,
    name,
    avatar,
    theme = 'dark',
}: {
    presenceURL: string;
    presenceAuth: {
        type: 'publickey' | 'token';
        // The public key in your Allegro Mesh project.
        publicKey?: string;
        // api for getting access token
        endpoint?: string;
    };
    room?: string;
    showLatency?: boolean;
    name?: string;
    avatar?: string;
    theme?: 'light' | 'dark';
}): JSX.Element | null => {
    const { me, others } = useOnlineCursor({
        presenceURL,
        presenceAuth,
        room,
        name,
        avatar,
    });

    if (!me) {
        return null;
    }

    return (
        <div className="online-cursor-wrapper">
            {others.map(item => (
                <OthersCursor
                    key={item.id}
                    cursor={item}
                    showLatency={showLatency}
                    theme={theme}
                />
            ))}
            <MeCursor cursor={me} showLatency={showLatency} theme={theme} />
        </div>
    );
};

function CursorIcon({ color }: { color: string }) {
    return useMemo(
        () => (
            <svg
                shapeRendering="geometricPrecision"
                xmlns="http://www.w3.org/2000/svg"
                fill={color}
            >
                <path
                    fill="#666"
                    d="M9.63 6.9a1 1 0 011.27-1.27l11.25 3.75a1 1 0 010 1.9l-4.68 1.56a1 1 0 00-.63.63l-1.56 4.68a1 1 0 01-1.9 0L9.63 6.9z"
                />
                <path
                    stroke="#fff"
                    strokeWidth="1.5"
                    d="M11.13 4.92a1.75 1.75 0 00-2.2 2.21l3.74 11.26a1.75 1.75 0 003.32 0l1.56-4.68a.25.25 0 01.16-.16L22.4 12a1.75 1.75 0 000-3.32L11.13 4.92z"
                />
            </svg>
        ),
        [color]
    );
}

export default memo(CursorChat);
