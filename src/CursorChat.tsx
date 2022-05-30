import React, { memo } from 'react';
import useOnlineCursor from './hooks/useOnlineCursor';
import OtherCursors from './OtherCursors';
import MeCursor from './MeCursor';
import './styles/dracula.css';

const CursorChat = ({
    presenceURL,
    presenceAuthEndpoint,
    room,
    showLatency = false,
    name,
    avatar,
    colors = ['#604CFF', '#FF0BC6', '#00C0ED', '#FFAB24', '#F52768'],
}: {
    presenceURL: string;
    presenceAuthEndpoint: string;
    room?: string;
    showLatency?: boolean;
    name?: string;
    avatar?: string;
    colors?: Array<string>;
}): JSX.Element | null => {
    const { me, others } = useOnlineCursor({
        presenceURL,
        presenceAuthEndpoint,
        room,
        name,
        avatar,
        color: `${colors[Math.floor(Math.random() * colors.length)]}`,
    });

    if (!me) {
        return null;
    }

    return (
        <div className="online-cursor-wrapper">
            <OtherCursors others={others} showLatency={showLatency} />
            <MeCursor cursor={me} showLatency={showLatency} />
        </div>
    );
};

export default memo(CursorChat);
