import { Courier, CourierClient } from '@trycourier/courier';
import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';

const courier = new CourierClient({});

export async function POST(
    req: NextRequest & {
        body: {
            title: string;
            body: string;
            actions: {
                href: string;
                content: string;
            }[];
        };
    }
) {
    const cookieStore = cookies();
    const user_id = cookieStore.get('user_id')?.value;
    const payload = await req.json();
    const { title, body, actions, urgent, ...data } = payload;

    if (!user_id) {
        return Response.json({ error: 'user_id not found' }, { status: 400 });
    } else {
        const all_actions: Courier.ElementalNode.Action[] = [
            ...(data?.full_page || data?.html || data?.pdf || data?.markdown
                ? [
                      {
                          type: 'action',
                          href: `/messages/{messageId}`,
                          content: 'Open Page',
                      },
                  ]
                : []),
            ...(actions || []).map((a) => ({
                type: 'action',
                ...a,
            })),
        ];
        const message: Courier.Message = {
            to: { user_id },
            data,
            content: {
                version: '2022-01-01',
                elements: all_actions,
                title,
                body,
            },
            routing: {
                method: 'single',
                channels: ['inbox'],
            },
            metadata: {},
        };
        if (urgent) {
            message['metadata']!['tags'] = ['urgent'];
        }

        const res = await courier.send({ message });
        return Response.json(res);
    }
}
