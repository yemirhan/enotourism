import Layout from '@/components/layout/Layout'
import { WinerySearch } from '@/components/wineries/WinerySearch'
import { trpc } from '@/utils/trpc'
import { Badge, Button, Container, Grid, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { OfferTypeEnum, WineTypes } from '@prisma/client'
import { IconPhoto } from '@tabler/icons'

import Link from 'next/link'

import React, { useState } from 'react'

export const Wineries = () => {
    const [search, setSearch] = useState("")
    const [countryId, setCountryId] = useState("")
    const [typeOfWine, setTypeOfWine] = useState<WineTypes | null>(null)
    const [activities, setActivities] = useState<OfferTypeEnum[]>([])
    const { data: wineries, isLoading } = trpc.wineries.searchWineries.useQuery({
        name: search,
        countryId: countryId.length > 0 ? countryId : undefined,
        typeOfWine: typeOfWine,
        activities: activities.length > 0 ? activities : undefined
    })

    return (
        <Layout>
            <Container size={"xl"}>
                <Stack spacing={"lg"}>
                    <Title>
                        Wineries
                    </Title>
                    <WinerySearch search={search} setSearch={setSearch} setActivities={setActivities} setTypeOfWine={setTypeOfWine} setCountryId={setCountryId} />
                    <Grid>
                        {
                            (wineries || []).map(winery => (
                                <Grid.Col span={4} key={winery.id}>
                                    <Paper withBorder p={"md"}>
                                        <Stack spacing={"xs"}>
                                            <Image src={winery.photos?.[0]?.url || ""} height={120} withPlaceholder alt="" />
                                            <Title order={3}>
                                                {winery.name}
                                            </Title>
                                            <Group>
                                                <Badge>
                                                    {winery.address?.country.name}
                                                </Badge>
                                            </Group>
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
                                        </Stack>
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