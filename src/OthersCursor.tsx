import React, { useEffect, useMemo, useState } from 'react';
import Others from './cursor/others';
import CursorIcon from './CursorIcon';
import Latency from './Latency';
import useRenderPosition from './hooks/useRenderPosition';

const OthersCursor = ({
    cursor,
    showLatency,
}: {
    cursor: Others;
    showLatency: boolean;
}) => {
    const refContainer = useRenderPosition(cursor);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        cursor.onTextMessage = (msg: string) => {
            setMsg(msg);
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
                ) : cursor.name && !cursor.avatar && !msg ? (
                    <span className="online-cursor-wrapper__name">
                        {cursor.name}
                    </span>
                ) : null}
                {msg && (
                    <div
                        className="online-cursor-wrapper__text"
                        style={{
                            paddingLeft:
                                cursor.name && !cursor.avatar && msg ? 10 : 40,
                        }}
                    >
                        {msg}
                    </div>
                )}
            </div>
        ),
        [msg, showLatency]
    );
};

export default OthersCursor;
