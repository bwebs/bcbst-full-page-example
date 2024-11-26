import Stack from '@mui/material/Stack';
import { cookies } from 'next/headers';
import Message from './Message';

interface IFullPageMessages {
    params: Promise<{ id: string }>;
}

const FullPageMessages = async ({ params }: IFullPageMessages) => {
    const id = (await params).id;
    const cookieStore = cookies();
    const user_id = cookieStore.get('user_id')?.value;
    return (
        <Stack alignItems={'center'} flexGrow={1} p={2} height="75vh">
            <Message id={id} user_id={user_id || ''} />
        </Stack>
    );
};

export default FullPageMessages;
