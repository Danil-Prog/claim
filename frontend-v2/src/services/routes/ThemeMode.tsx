import React from 'react';

import ThemeStore from '../../stores/ThemeStore';

function ThemeMode({ children }: any) {
	const { theme } = ThemeStore.state;

	return <div className={theme ? 'dark' : 'light'}>{children}</div>;
}

export default ThemeMode;
