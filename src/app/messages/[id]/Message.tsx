'use client';
import DeleteIcon from '@mui/icons-material/Delete';
import MailIcon from '@mui/icons-material/Mail';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import {
    Box,
    Button,
    Divider,
    Link,
    Paper,
    Stack,
    Typography,
} from '@mui/material';
import { Inbox } from '@trycourier/client-graphql';
import { IInboxMessagePreview } from '@trycourier/core';
import { cloneDeep, findIndex, get, set } from 'lodash';
import NavigationLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';

interface IMessage {
    id: string;
    user_id: string;
}

const Message = ({ id, user_id }: IMessage) => {
    const [message, setMessage] = useState<IInboxMessagePreview>();
    const [next, setNext] = useState<IInboxMessagePreview>();
    const [previous, setPrevious] = useState<IInboxMessagePreview>();
    const [inboxApi, setInboxApi] = useState(
        Inbox({
            clientKey: process.env['NEXT_PUBLIC_COURIER_CLIENT_KEY'],
            userId: user_id,
        })
    );

    const navigate = useRouter();

    const runInboxMessage = useCallback(async () => {
        const inboxApi = Inbox({
            clientKey: process.env['NEXT_PUBLIC_COURIER_CLIENT_KEY'],
            userId: user_id,
        });
        setInboxApi(inboxApi);
        const r = await inboxApi.getMessages({ limit: 1000 });
        const message_index = findIndex(r?.messages, { messageId: id });
        setMessage(get(r?.messages, [message_index]));
        setNext(get(r?.messages, [message_index - 1]));
        setPrevious(get(r?.messages, [message_index + 1]));
        inboxApi.markOpened(
            get(r?.messages, [message_index, 'messageId']) || ''
        );
    }, [id, user_id]);

    useEffect(() => {
        runInboxMessage();
    }, [id, runInboxMessage, user_id]);

    if (!message) {
        return <></>;
    } else {
        const actions = (get(message, ['actions'], []) ?? []).filter(
            (f) => !f.href?.startsWith('/messages/')
        );
        navigate;
        const is_read = get(message, ['read']);
        const markdown = get(
            message,
            ['data', 'full_page'],
            get(message, ['data', 'markdown'])
        );
        const pdf = get(message, ['data', 'pdf']);
        const html = get(message, ['data', 'html']);
        return (
            <Paper component={Stack} p={4} width={'600px'} gap={2} flexGrow={1}>
                <Typography textAlign={'center'} variant="h4">
                    {message.title}
                </Typography>
                <Typography textAlign={'center'} variant="h6">
                    {message.preview}
                </Typography>
                <Divider />
                <Stack sx={{ '& img': { width: '100%' } }} flexGrow={1}>
                    {markdown ? <Markdown>{markdown}</Markdown> : null}
                    {pdf ? (
                        <iframe
                            height="100%"
                            width="100%"
                            frameBorder={'0'}
                            src={pdf}
                        />
                    ) : null}
                    {html ? (
                        <iframe
                            height="100%"
                            width="100%"
                            frameBorder={'0'}
                            src={URL.createObjectURL(
                                new Blob([html], { type: 'text/html' })
                            )}
                        />
                    ) : null}
                </Stack>

                {actions?.length ? (
                    <Stack
                        direction="row"
                        gap={1}
                        justifyContent={'space-evenly'}
                    >
                        {actions.map((a, i) => {
                            return (
                                <Button
                                    key={`actions:${i}`}
                                    LinkComponent={NavigationLink}
                                    href={a.href}
                                    variant="text"
                                    color={
                                        i % 2 === 0 ? 'primary' : 'secondary'
                                    }
                                >
                                    {a.content}
                                </Button>
                            );
                        })}
                    </Stack>
                ) : (
                    <></>
                )}
                <Divider />
                <Stack justifyContent="flex-end" direction="row">
                    <Button
                        size="small"
                        variant="text"
                        color="error"
                        href={`/messages/${previous?.messageId}`}
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            inboxApi.markArchive(message.messageId);

                            if (next?.messageId || previous?.messageId) {
                                navigate.replace(
                                    `/messages/${
                                        next?.messageId || previous?.messageId
                                    }`
                                );
                            } else {
                                navigate.push('');
                            }
                        }}
                        endIcon={<DeleteIcon fontSize="small" />}
                    >
                        Archive
                    </Button>
                    <Button
                        size="small"
                        variant="text"
                        endIcon={
                            is_read ? (
                                <MarkEmailReadIcon fontSize="small" />
                            ) : (
                                <MailIcon fontSize="small" />
                            )
                        }
                        onClick={() => {
                            if (is_read) {
                                inboxApi.markUnread(message.messageId);
                            } else {
                                inboxApi.markRead(message.messageId);
                            }
                            setMessage((p) => {
                                if (p) {
                                    const newp = cloneDeep(p);
                                    set(newp, ['read'], !is_read);
                                    return newp;
                                }
                            });
                        }}
                    >
                        Mark As {message.read ? 'Unread' : 'Read'}
                    </Button>
                </Stack>
                <Stack direction={'row'} justifyContent={'space-around'}>
                    <Link
                        underline="hover"
                        variant="caption"
                        sx={{
                            visibility: previous?.messageId
                                ? 'visible'
                                : 'hidden',
                        }}
                        component={NavigationLink}
                        href={`/messages/${previous?.messageId}`}
                    >
                        Previous
                    </Link>
                    <Link
                        underline="hover"
                        variant="caption"
                        sx={{
                            visibility: next?.messageId ? 'visible' : 'hidden',
                        }}
                        component={NavigationLink}
                        href={`/messages/${next?.messageId}`}
                    >
                        Next
                    </Link>
                </Stack>
            </Paper>
        );
    }
};

export default Message;
