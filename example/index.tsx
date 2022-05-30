import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CursorChat from '../dist';
import '../dist/dracula.css';

const App = () => {
    return (
        <div className="main">
            <p className="tips">
                Press <span>/</span> to bring up the input box <br /> Press{' '}
                <span>ESC</span> to close the input box
            </p>
            <CursorChat
                showLatency={true}
                presenceURL="https://prsc.yomo.dev"
                presenceAuthEndpoint="/.netlify/functions/presence-auth"
                avatar="https://s3.bmp.ovh/imgs/2022/05/25/7a27bbdcae90a11f.png"
                room="cursor-chat-example"
                name="name"
                // colors={['black','white','grey'......]}
            />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
