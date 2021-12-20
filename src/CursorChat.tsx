import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import useOnlineCursor from './hooks/useOnlineCursor';
import useRenderPosition from './hooks/useRenderPosition';
import Me from './cursor/me';
import Others from './cursor/others';
import './styles/cursor-chat.less';

const inputValue$ = new Subject<string>();

const MeCursor = ({
    cursor,
    theme
}: {
    cursor: Me;
    theme?: 'light' | 'dark'
}) => {
    const refContainer = useRenderPosition(cursor);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const onKeydown = useCallback(e => {
        if (e.code === 'Slash') {
            setShowInput(true);
        }

        if (e.code === 'Escape') {
            setShowInput(false);
            setInputValue('');
            inputValue$.next('');
        }
    }, []);

    const onChangeInput = useCallback(e => {
        const inputValue = e.target.value;
        if (inputValue === '/') {
            return;
        }
        setInputValue(inputValue);
        inputValue$.next(inputValue);
    }, []);

    useEffect(() => {
        inputValue$.pipe(debounceTime(100)).subscribe(inputValue => {
            cursor.sendMessage(inputValue);
        });
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
                {cursor.avatar && (
                    <img
                        className="online-cursor-wrapper__avatar"
                        src={cursor.avatar}
                        alt="avatar"
                    />
                )}
                {showInput && (
                    <div className={`online-cursor-wrapper__input-box ${theme === 'light' ? 'light' : 'dark'}`}>
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
        [showInput, inputValue]
    );
};

const OthersCursor = ({
    cursor,
    theme
}: {
    cursor: Others;
    theme?: 'light' | 'dark'
}) => {
    const refContainer = useRenderPosition(cursor);
    const [msg, setMsg] = useState(cursor.name);

    useEffect(() => {
        cursor.onTextMessage = (msg: string) => {
            setMsg(msg);
        };
    }, []);

    return useMemo(
        () => (
            <div
                className="online-cursor-wrapper__cursor"
                ref={refContainer}
            >
                <CursorIcon color={cursor.color} />
                {cursor.avatar && (
                    <img
                        className="online-cursor-wrapper__avatar"
                        src={cursor.avatar}
                        alt="avatar"
                    />
                )}
                {msg && (
                    <div className={`online-cursor-wrapper__text ${theme === 'light' ? 'light' : 'dark'}`}>{msg}</div>
                )}
            </div>
        ),
        [msg]
    );
};

const CursorChat = ({
    socketURL,
    name,
    avatar,
    theme = 'dark'
}: {
    socketURL: string;
    name?: string;
    avatar?: string;
    theme?: 'light' | 'dark'
}): JSX.Element | null => {
    const { me, others } = useOnlineCursor({
        socketURL,
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
                    theme={theme}
                />
            ))}
            <MeCursor cursor={me} theme={theme} />
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
