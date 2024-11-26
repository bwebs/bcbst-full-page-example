'use client';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useRef, useState } from 'react';
import InputFileUpload from './UplaodButton';

interface ISendForm {
    type: 'pdf' | 'html' | 'markdown';
}

const SendForm = ({ type }: ISendForm) => {
    const [actions, setActions] = useState(0);
    const [files, setFiles] = useState<any>();
    const ref = useRef<HTMLFormElement>(null);
    const handleClick = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        var formData = Array.from(
            new FormData(e.currentTarget).entries()
        ).reduce((p, v, k) => {
            if (v[0].startsWith('actions')) {
                const [_, index, key] =
                    v[0].match(/actions\[(\d+)\]\[(\w+)\]/) ?? [];
                if (!p['actions']) {
                    p['actions'] = [];
                }
                if (!p['actions'][index]) {
                    p['actions'][index] = {};
                }
                p['actions'][index][key] = v[1];
                return p;
            } else {
                p[v[0]] = v[1];
            }
            return p;
        }, {});
        if (files?.length) {
            formData['pdf'] = files;
        }

        const r = await fetch('/api/courier/send-inbox-test', {
            method: 'POST',
            body: JSON.stringify(formData),
        }).then((r) => r.json());
    };
    console.log(files);
    return (
        <Stack direction="row" flexGrow={1}>
            <Stack
                flexGrow={1}
                component={'form'}
                ref={ref}
                onSubmit={handleClick}
                gap={1}
                p={2}
            >
                <TextField variant="standard" label="Title" name="title" />
                <TextField
                    variant="standard"
                    label="Preview"
                    name="body"
                    multiline
                    minRows={2}
                />

                {type !== 'pdf' ? (
                    <TextField
                        variant="standard"
                        label="Full Page"
                        name={type}
                        multiline
                        minRows={2}
                        maxRows={15}
                    />
                ) : (
                    <InputFileUpload
                        updateFiles={(f) => {
                            setFiles(f);
                        }}
                    />
                )}
                <FormControlLabel
                    control={<Checkbox name="urgent" />}
                    label="Urgent"
                />
                {actions > 0 && (
                    <Stack direction="row" gap={1} alignItems={'flex-end'}>
                        <TextField
                            variant="standard"
                            label="Text"
                            name="actions[0][content]"
                        />
                        <TextField
                            variant="standard"
                            label="href"
                            name="actions[0][href]"
                        />
                        <IconButton
                            onClick={() => setActions((a) => a - 1)}
                            sx={{
                                visibility: actions > 1 ? 'hidden' : 'visible',
                                height: 'fit-content',
                            }}
                            size="small"
                        >
                            <RemoveIcon />
                        </IconButton>
                    </Stack>
                )}
                {actions > 1 && (
                    <Stack direction="row" gap={1} alignItems={'flex-end'}>
                        <TextField
                            variant="standard"
                            label="Text"
                            name="actions[1][content]"
                        />
                        <TextField
                            variant="standard"
                            label="href"
                            name="actions[1][href]"
                        />
                        <IconButton
                            onClick={() => setActions((a) => a - 1)}
                            size="small"
                            sx={{
                                height: 'fit-content',
                            }}
                        >
                            <RemoveIcon />
                        </IconButton>
                    </Stack>
                )}
                <Stack
                    direction="row"
                    gap={1}
                    justifyContent={'space-between'}
                    mt={1}
                >
                    <Button
                        variant="text"
                        onClick={() => setActions((a) => a + 1)}
                        sx={{ visibility: actions > 1 ? 'hidden' : 'visible' }}
                    >
                        Add Action
                    </Button>
                    <Button variant="contained" type="submit">
                        Send to Inbox
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default SendForm;
