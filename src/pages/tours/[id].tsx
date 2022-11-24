import Layout from '@/components/layout/Layout'
import { TourCarousel } from '@/components/tour/TourCarousel';
import { TourTabs } from '@/components/tour/TourTabs';
import { Anchor, Breadcrumbs, Button, Container, Grid, NumberInput, Paper, Stack, Table, Text, Title } from "@mantine/core"
import { Calendar, TimeInput } from "@mantine/dates";
import { IconChevronRight } from "@tabler/icons";
import Link from 'next/link';
import React, { useState } from 'react'

const items = [
    { title: 'Home', href: '/' },
    { title: 'Tours', href: '/tours' },
    { title: 'Tour Title', href: '#' },
].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
        {item.title}
    </Anchor>
));
const elements = [
    { position: "10:00-18:00", symbol: '49 €', name: 30 },
];

const Tour = () => {
    const [people, setPeople] = useState(1)
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{element.position}</td>
            <td>{element.symbol}</td>
            <td>{element.name}</td>
        </tr>
    ));
    return (
        <Layout>
            <Container>
                <Grid gutter={"lg"}>
                    <Grid.Col span={8}>
                        <Stack spacing={"lg"}>
                            <Breadcrumbs separator={<IconChevronRight size={18} />}>{items}</Breadcrumbs>
                            <TourCarousel />
                            <TourTabs />
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Paper radius="md" p="xl" withBorder>
                            <Stack spacing={"sm"}>
                                <Text>FROM</Text>
                                <Title>40 €</Title>
                                <Text>Per Person</Text>

                                <Text>Available Dates</Text>
                                <Calendar fullWidth></Calendar>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Opening Hours</th>
                                            <th>Price</th>
                                            <th>Open Slots</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </Table>
                                <TimeInput label="Time of Visit" />
                                <NumberInput
                                    defaultValue={1}
                                    placeholder="Number of People"
                                    label="Number of People"
                                    value={people}
                                    onChange={(value) => setPeople(value || 1)}
                                    min={1}
                                />

                                <Button fullWidth>
                                    Book Now
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid.Col>
                </Grid>
            </Container>
        </Layout>
    )
}

export default Tour