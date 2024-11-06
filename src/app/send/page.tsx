import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CourierClient } from '@trycourier/courier';
import fetch from 'node-fetch';
import SendForm from './components/Form';

const courier = new CourierClient({
    fetcher: async (args) => {
        const r = await fetch(args.url, args).then((r) => r.json());
        return { body: r.data, error: {}, ok: r.ok, status: r.status };
    },
});

export default async function SendPage() {
    return (
        <Stack mt={4} direction="row">
            <Stack component={Paper} px={3} minWidth={'500px'} flexGrow={1}>
                <Typography variant="h6" textAlign={'center'}>
                    Message current user&apos;s inbox
                </Typography>
                <SendForm />
            </Stack>
            <Stack flexGrow={1} px={3}>
                <Typography variant="h6" textAlign={'center'}>
                    Markdown Example
                </Typography>
                <Typography variant="caption" whiteSpace={'pre-wrap'}>
                    {`
A **changelog** records all significant changes made to a project, typically software or a website. It's a chronological list of changes that helps users, developers, and stakeholders understand how the project has evolved. 

> Changelogs can include details about: new features, bug fixes, enhancements, minor tweaks, and deprecated features. Changelogs are often located in the root directory of a project and named "CHANGELOG.md" or "HISTORY.txt." They are typically updated with each new project version. 

Here is a [cat link](https://en.wikipedia.org/wiki/Cat)
Here is a cat picture
![cat picture](https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg)

### Changelogs can be helpful for:
- **Keeping employees informed:** Changelogs can help ensure that employees are informed about critical updates and changes in larger projects. 
- **Keeping users informed:** Changelogs can help users stay informed about changes affecting their experience. 
- **Fostering collaboration:** Changelogs can serve as a communication channel and knowledge base for product teams. 
- **Framing product messaging:** Product Marketing Managers can use changelogs to help frame product messaging and positioning. 
`}
                </Typography>
            </Stack>
        </Stack>
    );
}
