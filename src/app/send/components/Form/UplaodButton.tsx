import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function InputFileUpload({
    updateFiles,
}: {
    updateFiles: (files: any) => void;
}) {
    const handleFile = (event) => {
        console.log(event);
        var file = event.target.files[0];
        var reader = new FileReader();
        reader.readAsBinaryString(file);

        reader.onload = function () {
            // @ts-ignore
            updateFiles('data:application/pdf;base64,' + btoa(reader.result));
        };
        reader.onerror = function () {
            console.log('there are some problems');
        };
    };
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            Upload files
            <VisuallyHiddenInput
                type="file"
                onChange={handleFile}
                accept=".pdf"
            />
        </Button>
    );
}
