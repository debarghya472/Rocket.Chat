import React from 'react';
import { Box, Margins, ButtonGroup, Button, Icon } from '@rocket.chat/fuselage';
import { css } from '@rocket.chat/css-in-js';
import { useMutableCallback } from '@rocket.chat/fuselage-hooks';

import VerticalBar from '../../components/basic/VerticalBar';
import UserCard from '../../components/basic/UserCard';
import { FormSkeleton } from './Skeleton';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';
import { useTranslation } from '../../contexts/TranslationContext';
import { useRoute } from '../../contexts/RouterContext';


const wordBreak = css`
	word-break: break-word;
`;
const Label = (props) => <Box fontScale='p2' color='default' {...props} />;
const Info = ({ className, ...props }) => <UserCard.Info className={[className, wordBreak]} flexShrink={0} {...props}/>;

export function ContactInfo({ id }) {
	const t = useTranslation();
	const directoryRoute = useRoute('omnichannel-directory');

	const onEditButtonClick = useMutableCallback(() => directoryRoute.push({
		tab: 'contacts',
		context: 'edit',
		id,
	}));

	const { data, state, error } = useEndpointDataExperimental(`contact?contactId=${ id }`);
	if (state === ENDPOINT_STATES.LOADING) {
		return <FormSkeleton />;
	}

	if (error || !data || !data.contact) {
		return <Box mbs='x16'>{t('Contact_not_found')}</Box>;
	}
	const { contact } = data;

	const { name, username, visitorEmails, phone } = contact;

	return <>
		<VerticalBar.ScrollableContent p='x24'>
			<Margins block='x4'>
				{username && username !== name && <>
					<Label>{t('Name/Username')}</Label>
					<Info>{`${ name }/${ username }`}</Info>
				</>}
				{visitorEmails && visitorEmails.length && <>
					<Label>{t('Email')}</Label>
					<Info>{visitorEmails[0].address}</Info>
				</>}
				{phone && phone.length && <>
					<Label>{t('Phone')}</Label>
					<Info>{phone[0].phoneNumber}</Info>
				</>}
				<Label>{t('CreatedAt')}</Label>
				<Info>November 12, 2020</Info>

				<Label>{t('LastChat')}</Label>
				<Info>November 12, 2020</Info>
			</Margins>
		</VerticalBar.ScrollableContent>
		<VerticalBar.Footer>
			<ButtonGroup stretch>
				<Button><Icon name='history' size='x20'/> {t('Chat_History')}</Button>
				<Button onClick={onEditButtonClick}><Icon name='pencil' size='x20'/> {t('Edit')}</Button>
			</ButtonGroup>
		</VerticalBar.Footer>
	</>;
}
