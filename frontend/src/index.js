import React from 'react';
import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.scss';
import App from './App';
import 'babel-polyfill';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<BrowserRouter>
		<ThemeProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</ThemeProvider>
	</BrowserRouter>
);
