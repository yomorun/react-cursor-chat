# react-cursor-chat

A react component for cursor chat

-   Press `/` to bring up the input box
-   Press `ESC` to close the input box

### Installation

```
$ npm i --save @yomo/react-cursor-chat
```

### Usage

```jsx
import React from 'react';
import CursorChat from '@yomo/react-cursor-chat';
import '@yomo/react-cursor-chat/dist/cursor-chat.min.css';

// `wss://ws-dev.yomo.run` is YoMo's demo service
<CursorChat
    socketURL="wss://ws-dev.yomo.run"
    avatar="https://avatars.githubusercontent.com/u/67308985?s=200&v=4"
/>
```

-   `socketURL: string`: to set the WebSocket service address.
-   `avatar?: string`: to set avatar.
-   `name?: string`: to set name.
-   `theme?: 'light' | 'dark'`: The background color of the chat box, the default value is "dark".

Or use hooks and customize the components yourself:

```tsx
import React, { useMemo } from 'react';
import { useOnlineCursor, useRenderPosition } from '@yomo/react-cursor-chat';

// You can customise the content of your own mouse block
const MeCursor = ({ cursor }) => {
    const refContainer = useRenderPosition(cursor);

    return useMemo(
        () => (
            <div className="cursor" ref={refContainer}>
                <CursorIcon color={cursor.color} />
                {cursor.name && <div>{cursor.name}</div>}
                {cursor.avatar && (
                    <img className="avatar" src={cursor.avatar} alt="avatar" />
                )}
            </div>
        ),
        []
    );
};

// You can customise what other people's mouse blocks can display
const OthersCursor = ({ cursor }) => {
    const refContainer = useRenderPosition(cursor);
    return (
        <div ref={refContainer} className="cursor">
            <CursorIcon color={cursor.color} />
        </div>
    );
};

// Exporting your custom components
export const YourComponent = ({
    socketURL,
    name,
    avatar
}) => {
    const { me, others } = useOnlineCursor({
        socketURL,
        name,
        avatar,
    });

    if (!me) {
        return null;
    }

    return (
        <div className="container">
            {others.map(item => (
                <OthersCursor key={item.id} cursor={item} />
            ))}
            <MeCursor cursor={me} />
        </div>
    );
};

function CursorIcon({ color }) {
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
```

[Example](https://github.com/osdodo/cursor-chat/example)

### LICENSE

<a href="/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
</a>
