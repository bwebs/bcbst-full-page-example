'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack,
    SelectChangeEvent,
    ListItemButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useInbox } from '@trycourier/react-hooks';
import { views } from '@/components/Courier/Inbox';

// Notification type definition
interface Notification {
    id: string;
    title: string;
    description: string;
    type: 'important' | 'info' | 'covid';
    isRead: boolean;
}

export type TReadFilterType = 'all' | 'read' | 'unread' | 'archived' | 'urgent';

// Mock notifications data
const notifications: Notification[] = [
    {
        id: '1',
        title: 'Important Pharmacy Changes',
        description:
            'Read about changes to your pharmacy and prescription coverage.',
        type: 'important',
        isRead: false,
    },
    {
        id: '2',
        title: 'Set Up Automatic Payments',
        description:
            'Your benefits and ID cards will be active once your first payment is processed. Want to make your payment now? Download the Bank Draft Form Authorization and set up bank drafts to pay health insurance premiums automatically each month, or call our Membership and Billing team at 1-800-000-0000, Monday–Friday 8 a.m. – 5:15 p.m. ET.',
        type: 'info',
        isRead: false,
    },
    {
        id: '3',
        title: 'COVID-19',
        description:
            'Important information about COVID-19 coverage and resources.',
        type: 'covid',
        isRead: false,
    },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    margin: theme.spacing(2),
    borderRadius: theme.spacing(1),
}));

const NotificationsPage = () => {
    const [activeTab, setActiveTab] = useState(1);
    const inbox = useInbox();
    const [readFilter, setReadFilter] = useState<TReadFilterType>(
        (inbox.view || 'all') as TReadFilterType
    );

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleReadFilterChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value as TReadFilterType;
        const params = views?.filter((v) => v.id === value)[0]?.params || {};
        setReadFilter(value);
        inbox.setView(value);
        inbox.fetchMessages({ params });
    };

    const handleMarkAllRead = () => {
        inbox.markAllAsRead();
    };

    return (
        <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 3 }}>
            <Typography variant="h6" sx={{ mb: 4 }}>
                Full Page Inbox Example
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Document Center" />
                    <Tab label="Notifications" />
                </Tabs>
            </Box>

            <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Stack direction="row" spacing={2}>
                        <StyledPaper sx={{ height: 'fit-content' }}>
                            <Stack gap={2} flexGrow={0}>
                                <Typography>Filter Notifications</Typography>
                                <FormControl
                                    size="small"
                                    sx={{ minWidth: 200 }}
                                >
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={readFilter}
                                        label="Status"
                                        onChange={handleReadFilterChange}
                                    >
                                        <MenuItem value="all">
                                            Read & Unread
                                        </MenuItem>
                                        <MenuItem value="read">Read</MenuItem>
                                        <MenuItem value="unread">
                                            Unread
                                        </MenuItem>
                                        <MenuItem value="archived">
                                            Archived
                                        </MenuItem>
                                        <MenuItem value="urgent">
                                            Urgent
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </StyledPaper>
                        <Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                                <Typography>
                                    {'Filter Results: '}
                                    <strong>
                                        {inbox.messages?.length} Notification
                                        {inbox.messages?.length === 1
                                            ? ''
                                            : 's'}
                                    </strong>
                                </Typography>
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={handleMarkAllRead}
                                >
                                    Mark All As Read
                                </Button>
                            </Stack>

                            <List sx={{ minWidth: '500px' }}>
                                {(inbox.messages ?? []).map((notification) => {
                                    const full_page =
                                        notification?.actions?.find((a) =>
                                            a.href.startsWith('/messages/')
                                        );
                                    const actions =
                                        notification?.actions?.filter(
                                            (a) =>
                                                !a.href.startsWith('/messages/')
                                        );
                                    const Component =
                                        full_page ?? actions?.length
                                            ? ListItemButton
                                            : ListItem;

                                    console.log({ full_page, actions });
                                    return (
                                        <StyledPaper
                                            key={notification.messageId}
                                            elevation={1}
                                        >
                                            {/* @ts-ignore */}
                                            <Component
                                                disablePadding
                                                onClick={() => {
                                                    inbox.markMessageRead(
                                                        notification.messageId
                                                    );
                                                }}
                                                // @ts-ignore
                                                href={
                                                    full_page
                                                        ? `/messages/${notification.messageId}`
                                                        : actions?.[0]?.href
                                                }
                                            >
                                                <Stack gap={1}>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        spacing={1}
                                                    >
                                                        <ListItemText
                                                            primary={
                                                                <Stack
                                                                    direction="row"
                                                                    alignItems="center"
                                                                    spacing={1}
                                                                >
                                                                    {!notification.read && (
                                                                        <Box
                                                                            sx={{
                                                                                width: 8,
                                                                                height: 8,
                                                                                borderRadius:
                                                                                    '50%',
                                                                                bgcolor:
                                                                                    'red',
                                                                            }}
                                                                        />
                                                                    )}
                                                                    <Typography
                                                                        variant="h6"
                                                                        color="primary"
                                                                        gutterBottom
                                                                    >
                                                                        {
                                                                            notification.title
                                                                        }
                                                                    </Typography>
                                                                </Stack>
                                                            }
                                                            secondary={
                                                                <Typography
                                                                    variant="body2"
                                                                    color="text.secondary"
                                                                >
                                                                    {
                                                                        notification.preview
                                                                    }
                                                                </Typography>
                                                            }
                                                        />
                                                    </Stack>
                                                    <Stack
                                                        direction="row"
                                                        gap={1}
                                                    >
                                                        {(actions ?? []).map(
                                                            (a, i) => (
                                                                <Button
                                                                    key={a.href}
                                                                    href={
                                                                        a.href
                                                                    }
                                                                    variant="text"
                                                                    sx={{
                                                                        textTransform:
                                                                            'inherit',
                                                                    }}
                                                                    color={
                                                                        i %
                                                                            2 ===
                                                                        0
                                                                            ? 'primary'
                                                                            : 'secondary'
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        e.stopPropagation();
                                                                        inbox.markMessageRead(
                                                                            notification.messageId
                                                                        );
                                                                    }}
                                                                >
                                                                    {a.content}
                                                                </Button>
                                                            )
                                                        )}
                                                    </Stack>
                                                </Stack>
                                            </Component>
                                        </StyledPaper>
                                    );
                                })}
                            </List>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default NotificationsPage;
