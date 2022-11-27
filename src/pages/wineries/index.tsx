import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Button, Container, Grid, Paper, Stack, Text, Title } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'

import React from 'react'

export const Wineries = () => {
    const { data: wineries, isLoading } = trpc.wineries.getWineries.useQuery()

    return (
        <Layout>
            <Container>
                <Stack spacing={"lg"}>
                    <Title>
                        Wineries
                    </Title>

                    <Grid>
                        {
                            (wineries || []).map(winery => (
                                <Grid.Col span={4} key={winery.id}>
                                    <Paper withBorder p={"md"}>

                                        <Title order={3}>
                                            {winery.name}
                                        </Title>
                                        <Text lineClamp={3}>
                                            {winery.description}
                                        </Text>
                                        <Button
                                            component={Link}
                                            href={`/wineries/${winery.id}`}
                                            fullWidth
                                        >
                                            View Winery
                                        </Button>
                                    </Paper>
                                </Grid.Col>
                            ))
                        }
                    </Grid>
                </Stack>
            </Container>
        </Layout>
    )
}
export default Wineries