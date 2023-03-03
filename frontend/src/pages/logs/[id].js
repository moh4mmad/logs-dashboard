import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { LogView } from 'src/sections/logs/view';
import { useRouter } from 'next/router'
import { toast } from "react-toastify";
import API from "src/services/api";

const Page = () => {
    const router = useRouter()
    const { id } = router.query
    return (
        <>
        <Head>
            <title>
                Log Details
            </title>
        </Head>
        <Box
        component="main"
        sx={{
            flexGrow: 1,
            py: 8
        }}
        >
        <Container maxWidth="lg">
            <Stack spacing={3}>
            <div>
                <Typography variant="h4">
                    Log Details
                </Typography>
            </div>
            <div>
                <LogView
                    id={id}
                />
            </div>
            </Stack>
        </Container>
        </Box>
    </>
    )
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;