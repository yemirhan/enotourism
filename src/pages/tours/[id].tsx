import Layout from '@/components/layout/Layout'
import { TourCarousel } from '@/components/tour/TourCarousel';
import { TourTabs } from '@/components/tour/TourTabs';
import { trpc } from '@/utils/trpc';
import { Anchor, Avatar, Badge, Breadcrumbs, Button, Container, Flex, Grid, Group, Loader, NumberInput, Paper, Stack, Table, Text, Title, useMantineTheme } from "@mantine/core"
import { Calendar, TimeInput } from "@mantine/dates";
import { showNotification } from '@mantine/notifications';
import { IconChevronRight } from "@tabler/icons";
import dayjs from 'dayjs';
import Decimal from 'decimal.js';
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
    const theme = useMantineTheme()
    const { mutate: reserve } = trpc.reservations.reserve.useMutation({
        onSuccess: () => {
            showNotification({
                title: 'Reservation created',
                message: 'Your reservation has been created',
            })
            router.push("/dashboard/reservations")
        }
    })
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState(new Date())

    const [people, setPeople] = useState(1)
    const [kids, setKids] = useState(0)
    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{`${dayjs(tour?.startTime).format("HH:mm")}`}</td>
            <td>{`${tour?.if_selected_all} €`}</td>
            <td>{tour?.max_number_of_people}</td>
            <td></td>
            <td></td>
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
                            <TourCarousel data={tour?.photos.map(photo => photo.url)} />
                            <Title>
                                {tour?.name}
                            </Title>
                            <Flex gap={"md"}>
                                {(tour?.TourActivities || []).map(activity => {
                                    return <Badge key={activity.id} >
                                        {activity.activity}
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
                            {
                                tour?.Winery.map(winery => {
                                    return <Paper key={winery.id} withBorder p="lg">
                                        <Group position='apart'>
                                            <Stack>
                                                <Title>
                                                    {winery.name}
                                                </Title>
                                                <Flex direction={"row"} gap="sm">
                                                    <Badge >
                                                        {winery.address?.country.name}
                                                    </Badge>
                                                    <Badge >
                                                        {`${winery._count.Wine} wines`}
                                                    </Badge>
                                                </Flex>
                                                <Text>
                                                    {winery.description}
                                                </Text>
                                            </Stack>
                                            <Button
                                                component={Link}
                                                href={`/wineries/${winery.id}`}
                                                variant='light'>
                                                View Winery
                                            </Button>
                                        </Group>
                                    </Paper>
                                })
                            }

                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Paper radius="md" p="xl" withBorder>
                            <Stack spacing={"sm"}>
                                <Text>FROM</Text>
                                <Title>{`${tour?.price_per_adult} €`} </Title>
                                <Text>Per Person</Text>
                                <Title order={2}>{`${tour?.price_per_kid} €`} </Title>
                                <Text>Per Child</Text>

                                <Text>Available Dates</Text>
                                <Calendar
                                    initialMonth={new Date(2021, 7)}
                                    onChange={() => console.log()}
                                    fullWidth
                                    dayStyle={(date) =>
                                        (tour?.startDate.getDate() === date.getDate()) || (tour?.endDate.getDate() === date.getDate())
                                            ? { backgroundColor: theme.colors.red[9], color: theme.white }
                                            : {}
                                    }
                                />
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Tour Starts at</th>
                                            <th>Price Full Slot</th>
                                            <th>Open Slots</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </Table>
                                <NumberInput
                                    placeholder="Number of Adults"
                                    label="Number of People"
                                    // max={(tour?.offer?.max_number_of_people || 0) - kids}
                                    value={people}
                                    onChange={(value) => setPeople(value || 1)}
                                    min={1}
                                />
                                <NumberInput

                                    placeholder="Number of Children"
                                    label="Number of Children"
                                    // max={(tour?.offer?.max_number_of_people || 0) - people}
                                    value={kids}
                                    onChange={(value) => setKids(value || 0)}
                                    min={0}
                                />
                                {/* <Text>
                                    {`Total: ${tour?.offer?.adult_price?.mul(people) + ((tour?.offer?.kid_price?.toNumber() || 0) * kids)} €`}
                                </Text> */}
                                <Button
                                    onClick={() => {
                                        reserve({
                                            date: selectedDate,
                                            from_time: (selectedTime.getHours() * 100) + selectedTime.getMinutes(),
                                            to_time: (selectedTime.getHours() * 100) + selectedTime.getMinutes(),
                                            number_of_people: people,
                                            number_of_kids: kids,
                                            tourId: router.query.id as string,
                                            offerId: [],
                                            guide_id: tour?.tour_guide.id,
                                            
                                        })
                                    }}
                                    fullWidth>
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