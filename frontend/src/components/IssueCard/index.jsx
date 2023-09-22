import React from 'react';

import style from './issueCard.module.scss';

function IssueCard({ Issue, active }) {
	return (
		<>
			{Issue && (
				<div
					className={
						Issue.issueStatus && Issue.issueStatus === 'COMPLETED'
							? `${style.card} ${style.statusCompleted} ${active}`
							: Issue.issueStatus === 'REVIEW'
							? `${style.card} ${style.statusReview} ${active}`
							: Issue.issueStatus === 'IN_PROGRESS'
							? `${style.card} ${style.statusInProgress} ${active}`
							: Issue.issueStatus === 'CANCELED'
							? `${style.card} ${style.statusCanceled} ${active}`
							: style.card
					}
				>
					<div className={style.title}>{Issue.title}</div>
					<div className={style.info}>
						<div className={style.customer}>
							Отправитель:
							{Issue.customer &&
								`${Issue.customer.profile.lastname} ${Issue.customer.profile.firstname}`}
						</div>

						<div className={style.executor}>
							Исполнитель:{` `}
							{Issue.executor
								? `${Issue.executor.profile.firstname} ${Issue.executor.profile.lastname}`
								: `Не назначен`}
						</div>

						<div className={style.startDate}>
							Дата отправки:{' '}
							{Issue.startDate
								? new Date(Issue.startDate)
										.toLocaleString()
										.slice(0, -10)
								: 'Неизвестно'}{' '}
						</div>

						{/*<div dangerouslySetInnerHTML={{ __html: Issue.description }} />*/}
					</div>
				</div>
			)}
		</>
	);
}

export default IssueCard;
