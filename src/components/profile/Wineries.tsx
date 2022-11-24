import { trpc } from '@/utils/trpc'
import { Button, Flex, Grid, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons'
import Link from 'next/link'
import React from 'react'

const YourWineries = () => {
    const { data: wineries, isLoading } = trpc.userWinery.getWineriesOfUser.useQuery()
    if (isLoading) return <Stack spacing={"lg"}>
        <Title>
            Your Wineries
        </Title>
        <Loader />
    </Stack>
    return (
        <>
            <Title order={3}>
                Wineries
            </Title>
            <Grid>
                {(wineries || []).length === 0 && <Grid.Col span={12}> <Paper  withBorder p={"xl"} radius="md">
                    <Flex align={"center"} direction="column"  justify="center">
                        <Text>
                            You do not have any wineries.
                        </Text>
                        <Button mt={"lg"} component={Link} href={"/dashboard/create_winery"} leftIcon={<IconPlus size={16} />}>
                            Click here to create one
                        </Button>
                    </Flex>
                </Paper></Grid.Col>}
                {(wineries || []).map(winery => (
                    <Grid.Col span={4} key={winery.id}>
                        <Paper withBorder p={"md"}>
                            <Text>
                                {winery.name}
                            </Text>
                        </Paper>
                    </Grid.Col>
                ))}
            </Grid>
        </>
    )
}

export default YourWineries