import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Container, Grid, Paper, Stack, Title } from '@mantine/core'

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
                                    <Paper withBorder>
                                        <Title>
                                            {winery.name}
                                        </Title>
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