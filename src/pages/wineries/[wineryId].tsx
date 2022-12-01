import Layout from '@/components/layout/Layout'
import { TourCarousel } from '@/components/tour/TourCarousel'
import { trpc } from '@/utils/trpc'
import { Anchor, Avatar, Badge, Breadcrumbs, Container, Flex, Grid, Group, Image, Paper, Stack, Text, Title } from '@mantine/core'
import { IconBottle, IconBottleOff, IconChevronRight } from '@tabler/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const items = [
    { title: 'Home', href: '/' },
    { title: 'Wineries', href: '/wineries' },
    { title: 'Winery', href: '#' },
].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
        {item.title}
    </Anchor>
));

const Winery = () => {
    const { query, isReady } = useRouter()

    const { data, isLoading } = trpc.wineries.getWineryById.useQuery({ id: query.wineryId as string }, {
        enabled: isReady
    })
    console.log(data);

    return (
        <Layout>
            <Container size={"lg"}>
                <Breadcrumbs my={"md"} separator={<IconChevronRight size={18} />}>{items}</Breadcrumbs>
                <Grid gutter={"lg"}>
                    <Grid.Col span={8}>
                        <Stack spacing={"lg"}>
                            <TourCarousel />
                            <Title>
                                {data?.name}
                            </Title>
                            <Text>
                                {data?.description} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam obcaecati, veniam rerum hic dolorem ut, quae numquam quam, tempore incidunt nam modi sed magni aut! Laborum optio soluta voluptatibus impedit.
                            </Text>
                            <Title order={2}>
                                Awards
                            </Title>
                            <Text>
                                {data?.awards}
                            </Text>
                            <Title order={2}>
                                History
                            </Title>
                            <Text>
                                {data?.history}

                            </Text>
                            <Title order={2}>
                                Wines
                            </Title>
                            {(data?.Wine || []).map(wine => {
                                return <Paper withBorder p={"md"} key={wine.id}>
                                    <Group>
                                        <Avatar src="" size={"lg"}  ><IconBottleOff size={24} /></Avatar>
                                        <Flex direction={"column"} gap="sm">
                                            <Title order={3}>
                                                {wine.name}
                                            </Title>
                                            <Group spacing={"sm"}>
                                                <Badge>
                                                    {wine.texture}
                                                </Badge>
                                                <Badge>
                                                    {wine.color}
                                                </Badge>
                                            </Group>
                                            <Text>
                                                {wine.brief_description}
                                            </Text>
                                        </Flex>
                                    </Group>
                                </Paper>
                            })}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Paper radius="md" p="xl" withBorder>
                            <Stack spacing={"sm"}>
                                <Title order={2}>
                                    {data?.owner.name}
                                </Title>
                                <Text>
                                    {data?.owner.email}
                                </Text>
                                <Text>
                                    {data?.owner.phone_number}
                                </Text>
                                <Title order={3}>
                                    About the owner
                                </Title>
                                <Text>
                                    {data?.owner.about}
                                </Text>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Container>
        </Layout>
    )
}

export default Winery