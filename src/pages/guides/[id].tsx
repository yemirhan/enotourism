import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc';
import { Anchor, Avatar, Breadcrumbs, Button, Container, Flex, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core'
import { Calendar } from '@mantine/dates';
import { IconChevronRight } from '@tabler/icons'
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

const items = [
    { title: 'Home', href: '/' },
    { title: 'Guides', href: '/Guides' },
    { title: 'Tour Guide', href: '#' },
].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
        {item.title}
    </Anchor>
));
const elements = [
    { position: "10:00-18:00", symbol: '49 €', name: 30 },
];

const Guide = () => {
    const { query } = useRouter();
    const router = useRouter();
    const { data, isLoading } = trpc.guides.getTourGuideById.useQuery({ id: query.id as string });
    console.log(query);

    return (
        <Layout>
            <Container>
                <Breadcrumbs mt={"lg"} separator={<IconChevronRight size={18} />}>{items}</Breadcrumbs>
                <Grid gutter={"lg"} mt="md">
                    <Grid.Col span={8}>
                        <Stack >

                            <Paper withBorder p="lg">
                                <Group>
                                    <Avatar src={data?.photo} size="xl" />
                                    <Stack>
                                        <Title order={3}>
                                            {`${data?.name} ${data?.surname}`}
                                        </Title>
                                        <Text>
                                            {data?.email}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Paper>
                            <Title>
                                About Tour Guide
                            </Title>
                            <Text>
                                {data?.about}
                            </Text>
                            <Title>
                                Tours
                            </Title>
                            {(data?.Tour || []).map(tour => {
                                return <Paper withBorder p={"md"} key={tour.id}>
                                    <Group position='apart'>
                                        <Stack>
                                            <Title order={3}>
                                                {tour.name}
                                            </Title>
                                            <Text>
                                                {tour.description}
                                            </Text>
                                        </Stack>
                                        <Button
                                            onClick={() => router.push(`/tours/${tour.id}`)}
                                        >
                                            View Tour
                                        </Button>
                                    </Group>
                                </Paper>
                            })}
                            {(data?.Tour || []).length === 0 && <Paper withBorder p={"md"}>
                                <Flex
                                    align={"center"}
                                    justify={"center"}
                                >
                                    <Text>
                                        This guide has no tours yet.
                                    </Text>
                                </Flex>
                            </Paper>}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Paper radius="md" p="xl" withBorder>
                            <Stack spacing={"sm"}>
                                <Text>FROM</Text>
                                <Title>{data?.address?.country}</Title>

                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Container>
        </Layout>
    )
}

export default Guide