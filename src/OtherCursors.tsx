import React from 'react';
import Others from './cursor/other';
import OthersCursor from './OtherCursor';

const OthersCursors = ({
    others,
    showLatency = false,
}: {
    others: Others[];
    showLatency?: boolean;
}) => {
    return (
        <>
            {others.map(item => (
                <OthersCursor
                    key={item.id}
                    cursor={item}
                    showLatency={showLatency}
                />
            ))}
        </>
    );
};

export default OthersCursors;
