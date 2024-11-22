'use client';

import { Inbox, InboxProps } from '@trycourier/react-inbox';

interface ICourierInbox {}

export const views: InboxProps['views'] = [
    {
        id: 'all',
        label: 'All',
    },
    {
        id: 'read',
        label: 'Read',
        params: {
            status: 'read',
        },
    },
    {
        id: 'unread',
        label: 'Unread',
        params: {
            status: 'unread',
        },
    },
    {
        id: 'archived',
        label: 'Archived',
        params: {
            archived: true,
        },
    },
    {
        id: 'urgent',
        label: 'Urgent',
        params: {
            tags: ['urgent'],
        },
    },
];

const CourierInbox = ({}: ICourierInbox) => {
    return <Inbox views={views} />;
};

export default CourierInbox;
