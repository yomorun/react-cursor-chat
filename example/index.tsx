import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CursorChat from '../.';
import '../dist/cursor-chat.min.css'

const App = () => {
    const [online, setOnline] = React.useState(true)
    return (
        <div>
            <div onClick={() => { setOnline(false) }} style={{ color: '#fff' }}>Go offline</div>
            {online && <CursorChat
                socketURL="wss://ws-dev.yomo.run"
                sendingTimeInterval={200}
                avatar="https://avatars.githubusercontent.com/u/67308985?s=200&v=4"
                theme="light"
            />}
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
