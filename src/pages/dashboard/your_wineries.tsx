import Layout from '@/components/layout/Layout'
import { WineryTable } from '@/components/userWineries/WineryTable'
import { trpc } from '@/utils/trpc'
import { Container, Loader, Stack, Title } from '@mantine/core'

import React from 'react'

const YourWineries = () => {
    const { data: wineries, isLoading } = trpc.userWinery.getWineriesOfUser.useQuery()
    if (isLoading) return <Loader />
    console.log(wineries);

    return (
        <Layout>
            <Container>
                <Stack>
                    <Title>
                        Your Wineries
                    </Title>
                    <WineryTable data={(wineries || []).map(d => ({
                        name: d.name,
                        email: d.email,
                        company: d.description,
                    }))} />
                </Stack>
            </Container>

        </Layout>
    )
}

export default YourWineries