import Layout from '@/components/layout/Layout'
import { TourCarousel } from '@/components/tour/TourCarousel';
import { TourTabs } from '@/components/tour/TourTabs';
import { trpc } from '@/utils/trpc';
import { Anchor, Avatar, Badge, Breadcrumbs, Button, Container, Flex, Grid, Group, Loader, NumberInput, Paper, Stack, Table, Text, Title } from "@mantine/core"
import { Calendar, TimeInput } from "@mantine/dates";
import { IconChevronRight } from "@tabler/icons";
import dayjs from 'dayjs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'

const items = (tourName?: string, tourId?: string) => [
    { title: 'Home', href: '/' },
    { title: 'Tours', href: '/tours' },
    { title: tourName, href: `/tours/${tourId}` },
].map((item, index) => (
    <Anchor component={Link} href={item.href} key={index}>
        {item.title}
    </Anchor>
));
const elements = [
    { position: "10:00-18:00", symbol: '49 ', name: 30 },
];

const Tour = () => {
    const router = useRouter();
    const { data: tour, isLoading } = trpc.tour.getTourById.useQuery({
        id: router.query.id as string
    }, {
        enabled: router.isReady
    })
    console.log(tour);

    const [people, setPeople] = useState(1)
    const [kids, setKids] = useState(0)
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{`${dayjs(tour?.offer.OfferTimeSlot?.[0]?.startDate).format("HH:mm")} - ${dayjs(tour?.offer.OfferTimeSlot?.[0]?.endDate).format("HH:mm")}`}</td>
            <td>{`${tour?.offer.price} €`}</td>
            <td>{tour?.offer.max_number_of_people}</td>
        </tr>
    ));
    if (isLoading) {
        return <Layout>
            <Loader />
        </Layout>
    }
    return (
        <Layout>
            <Container size={"lg"}>
                <Grid gutter={"lg"}>
                    <Grid.Col span={8}>
                        <Stack spacing={"lg"}>
                            <Breadcrumbs separator={<IconChevronRight size={18} />}>{items(tour?.name, tour?.id)}</Breadcrumbs>
                            <TourCarousel />
                            <Title>
                                {tour?.name}
                            </Title>
                            <Flex gap={"md"}>
                                {(tour?.offer.offer_types || []).map(offer_type => {
                                    return <Badge key={offer_type.id} >
                                        {offer_type.name}
                                    </Badge>
                                })}
                            </Flex>
                            <Title order={2}>
                                Tour Description
                            </Title>
                            <Text>
                                {tour?.description}
                            </Text>
                            <Title order={2}>
                                Tour Guide
                            </Title>
                            <Paper withBorder p="lg">
                                <Group>
                                    <Avatar src={tour?.tour_guide.photo} size="xl" />
                                    <Stack>
                                        <Title order={3}>
                                            {`${tour?.tour_guide.name} ${tour?.tour_guide.surname || ""}`}
                                        </Title>
                                        <Text>
                                            {tour?.tour_guide.email}
                                        </Text>
                                    </Stack>
                                </Group>
                            </Paper>
                            <Title order={2}>
                                Winery
                            </Title>
                            <Paper withBorder p="lg">
                                <Group position='apart'>
                                    <Stack>
                                        <Title>
                                            {tour?.Winery?.name}
                                        </Title>
                                        <Flex direction={"row"} gap="sm">
                                            <Badge >
                                                {tour?.Winery?.country.name}
                                            </Badge>
                                            <Badge >
                                                {`${tour?.Winery?._count.Wine} wines`}
                                            </Badge>
                                        </Flex>
                                        <Text>
                                            {tour?.Winery?.description}
                                        </Text>
                                    </Stack>
                                    <Button
                                        component={Link}
                                        href={`/wineries/${tour?.Winery?.id}`}
                                        variant='light'>
                                        View Winery
                                    </Button>
                                </Group>
                            </Paper>

                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Paper radius="md" p="xl" withBorder>
                            <Stack spacing={"sm"}>
                                <Text>FROM</Text>
                                <Title>{`${tour?.offer.adult_price} €`} </Title>
                                <Text>Per Person</Text>
                                <Title order={2}>{`${tour?.offer.kid_price} €`} </Title>
                                <Text>Per Child</Text>

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
                                    placeholder="Number of Adults"
                                    label="Number of People"
                                    max={(tour?.offer?.max_number_of_people || 0) - kids}
                                    value={people}
                                    onChange={(value) => setPeople(value || 1)}
                                    min={1}
                                />
                                <NumberInput

                                    placeholder="Number of Children"
                                    label="Number of Children"
                                    max={(tour?.offer?.max_number_of_people || 0) - people}
                                    value={kids}
                                    onChange={(value) => setKids(value || 0)}
                                    min={0}
                                />
                                {/* <Text>
                                    {`Total: ${tour?.offer?.adult_price?.mul(people) + ((tour?.offer?.kid_price?.toNumber() || 0) * kids)} €`}
                                </Text> */}
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