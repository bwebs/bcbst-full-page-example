'use client';

import { Typography, Button, Chip, ButtonBase } from '@mui/material';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import LaunchIcon from '@mui/icons-material/Launch';
import { useInbox } from '@trycourier/react-hooks';
import { useEffect } from 'react';

const SpendingChart = () => {
    const data = [
        { label: 'Visits', value: 300, color: '#2196F3' },
        { label: 'Prescriptions', value: 150, color: '#9C27B0' },
    ];

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    const createSvgPath = (startAngle: number, value: number) => {
        const angle = (value / total) * 360;
        const endAngle = startAngle + angle;
        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const largeArc = angle > 180 ? 1 : 0;

        // Create donut segment
        const outerPath = `
            M ${50 + 40 * Math.cos(startRad)} ${50 + 40 * Math.sin(startRad)}
            A 40 40 0 ${largeArc} 1 ${50 + 40 * Math.cos(endRad)} ${
            50 + 40 * Math.sin(endRad)
        }
        `;
        const innerPath = `
            L ${50 + 30 * Math.cos(endRad)} ${50 + 30 * Math.sin(endRad)}
            A 30 30 0 ${largeArc} 0 ${50 + 30 * Math.cos(startRad)} ${
            50 + 30 * Math.sin(startRad)
        }
            Z
        `;

        return outerPath + innerPath;
    };

    return (
        <div
            style={{
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <svg width="200" height="200" viewBox="0 0 100 100">
                {data.map((item, index) => {
                    const path = createSvgPath(currentAngle, item.value);
                    const angle = (item.value / total) * 360;
                    currentAngle += angle;

                    return (
                        <path
                            key={item.label}
                            d={path}
                            fill={item.color}
                            stroke="white"
                            strokeWidth="0.5"
                        />
                    );
                })}
            </svg>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginLeft: '16px',
                }}
            >
                {data.map((item) => (
                    <div
                        key={item.label}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '0.875rem',
                        }}
                    >
                        <div
                            style={{
                                width: '12px',
                                height: '12px',
                                backgroundColor: item.color,
                                borderRadius: '2px',
                            }}
                        />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function Home() {
    const inbox = useInbox();
    useEffect(() => {
        inbox.fetchMessages({ params: { limit: 3, status: 'unread' } });
    }, [inbox]);

    return (
        <Stack component="main" px={4} py={6}>
            {/* Header Section */}
            <Stack
                spacing={1}
                mb={4}
                sx={{
                    background:
                        'linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)',
                    padding: 3,
                    borderRadius: '20px',
                    '& .MuiTypography-root': {
                        color: 'white',
                    },
                    '& a': {
                        color: 'white',
                        textDecoration: 'underline',
                    },
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Welcome, Chris
                </Typography>
                <Typography>Plan: BlueCross BlueShield of Tennessee</Typography>
                <Typography>Subscriber ID: ABC123456789</Typography>
                <Typography>Group ID: 123456</Typography>
                <Typography>Policies: Medical, Dental, Vision</Typography>
                <Link href="/plan-details">View Plan Details</Link>
            </Stack>

            {/* Main Content */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                {/* Recent Claims Section */}
                <Stack
                    sx={{
                        bgcolor: 'background.paper',
                        p: 3,
                        borderRadius: 2,
                        flexGrow: 1,
                        boxShadow: 1,
                    }}
                    spacing={2}
                >
                    <Typography variant="h6">Recent Claims</Typography>

                    <Stack spacing={2}>
                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <LocalHospitalIcon color="primary" />
                                <Typography>John Hopkins</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                pl={4}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Visited on 08/23/23, For Chris Hall
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Chip label="Pending" size="small" />
                                    <Typography>--</Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <LocalHospitalIcon color="primary" />
                                <Typography>Thomas H. Smith</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                pl={4}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Visited on 08/22/23, For Chris Hall
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Chip
                                        label="Processed"
                                        size="small"
                                        color="success"
                                    />
                                    <Typography>$30.24</Typography>
                                </Stack>
                            </Stack>
                        </Stack>

                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <LocalPharmacyIcon color="primary" />
                                <Typography>123 Pharmacy</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                pl={4}
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Visited on 08/10/23, For Chris Hall
                                </Typography>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                >
                                    <Chip
                                        label="Processed"
                                        size="small"
                                        color="success"
                                    />
                                    <Typography>$65.61</Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>

                    <Link href="/claims" style={{ color: '#1976d2' }}>
                        View Claims
                    </Link>
                </Stack>

                {/* Right Side Sections */}
                <Stack spacing={3} sx={{ width: { xs: '100%', md: '400px' } }}>
                    {/* Pay Premium Section */}
                    <Stack
                        sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                        spacing={2}
                    >
                        <Typography variant="h6">Pay Premium</Typography>
                        <Stack spacing={2}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>Payment Due Date</Typography>
                                <Typography>08/10/2023</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>Amount Due</Typography>
                                <Typography>$1,000.46</Typography>
                            </Stack>
                            <Button
                                variant="contained"
                                endIcon={<LaunchIcon />}
                                fullWidth
                            >
                                View or Pay Premium
                            </Button>
                        </Stack>
                    </Stack>
                    {inbox?.messages?.length && inbox.messages.length > 0 ? (
                        <Stack
                            sx={{
                                bgcolor: 'background.paper',
                                p: 3,
                                borderRadius: 2,
                                boxShadow: 1,
                            }}
                            spacing={2}
                        >
                            <Typography variant="h6">
                                Unread Messages
                            </Typography>
                            <Stack spacing={2}>
                                {inbox.messages.map((message) => (
                                    <ButtonBase
                                        key={message.messageId}
                                        component={Link}
                                        href={message.actions?.[0]?.href || ''}
                                        onClick={() => {
                                            inbox.markMessageRead(
                                                message.messageId
                                            );
                                        }}
                                        sx={{
                                            alignSelf: 'flex-start',
                                        }}
                                    >
                                        <Stack>
                                            <Typography>
                                                {message.title}
                                            </Typography>
                                            <Typography variant="caption">
                                                {message.preview}
                                            </Typography>
                                        </Stack>
                                    </ButtonBase>
                                ))}
                            </Stack>
                        </Stack>
                    ) : null}

                    {/* Spending Summary Section */}
                    <Stack
                        sx={{
                            bgcolor: 'background.paper',
                            p: 3,
                            borderRadius: 2,
                            boxShadow: 1,
                        }}
                        spacing={2}
                    >
                        <Typography variant="h6">Spending Summary</Typography>
                        <Typography variant="body2" color="text.secondary">
                            As of October 12, 2023
                        </Typography>
                        <SpendingChart />
                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography>Total Spending</Typography>
                                <Typography>$450.00</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography color="primary">Visits</Typography>
                                <Typography>$300.00</Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                            >
                                <Typography sx={{ color: '#9C27B0' }}>
                                    Prescriptions
                                </Typography>
                                <Typography>$150.00</Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
}
