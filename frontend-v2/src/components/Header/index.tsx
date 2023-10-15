import React from 'react';

import style from './header.module.scss';

type HeaderProps = {
	title: string;
	subTitle?: string | null;
};

const Header = ({ title, subTitle }: HeaderProps): React.JSX.Element => {
	return (
		<section className={style.header}>
			<div className={style.titlePage}>
				<h2>{title}</h2>
				<span>{subTitle}</span>
			</div>
		</section>
	);
};

export default Header;
