import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { Container, Flex, Grid, Group, Image, Paper, Stack, Title } from '@mantine/core'

import React from 'react'

const Countries = () => {
    const { data: countries, isLoading } = trpc.countries.getCountries.useQuery()
    return (
        <Layout>
            <Container>
                <Stack>
                    <Title>
                        Countries
                    </Title>
                    <Grid>
                        {
                            (countries || []).map(country => {
                                return <Grid.Col span={4} key={country.id}>
                                    <Paper withBorder p={"md"} radius="md">
                                        <Flex direction={"row"} align="center" gap={"md"}>
                                            <Image src={country.image} alt="title" width={40} height="40" />
                                            <Title lineClamp={1} order={3}>
                                                {country.name}
                                            </Title>
                                        </Flex>
                                    </Paper>
                                </Grid.Col>
                            })
                        }
                    </Grid>
                </Stack>
            </Container>
        </Layout>
    )
}

export default Countries