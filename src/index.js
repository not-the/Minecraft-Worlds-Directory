import React from 'react'
import ReactDOM from 'react-dom/client'

// Components
import App from './App'

// Event listeners
// window.addEventListener('keydown', keyDownHandler);
// function keyDownHandler(event) {
//     console.log(event.key);
// }

// Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
