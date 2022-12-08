import Layout from '@/components/layout/Layout'
import { TourCarousel } from '@/components/tour/TourCarousel'
import { trpc } from '@/utils/trpc'
import { Anchor, Avatar, Badge, Breadcrumbs, Button, Container, Flex, Grid, Group, Image, NumberInput, Paper, Stack, Table, Text, Title } from '@mantine/core'
import { Calendar, TimeInput } from '@mantine/dates'
import { showNotification } from '@mantine/notifications'
import { Offer, OfferTimeSlot, OfferType } from '@prisma/client'
import { IconBottle, IconBottleOff, IconChevronRight } from '@tabler/icons'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

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
    const { data: offers } = trpc.offer.getWineryOffers.useQuery({ wineryId: query.wineryId as string }, { enabled: isReady })
    const [selectedOffer, setSelectedOffer] = useState<string | null>(null)


    console.log(offers);

    return (
        <Layout>
            <Container size={"lg"}>
                <Breadcrumbs my={"md"} separator={<IconChevronRight size={18} />}>{items}</Breadcrumbs>
                <Grid gutter={"lg"}>
                    <Grid.Col span={8}>
                        <Stack spacing={"lg"}>
                            <TourCarousel data={(data?.photos || [])?.map(p => p.url)} />
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
                        {(offers || []).map(offer => {
                            return <Paper withBorder p={"xl"} mt="md" key={offer.id}>
                                <Stack>
                                    <Title order={3}>
                                        {offer.name}
                                    </Title>
                                    <Text>
                                        {offer.description}
                                    </Text>
                                    <Button
                                        onClick={() => setSelectedOffer(offer.id)}
                                        disabled={selectedOffer === offer.id}
                                        fullWidth>
                                        {selectedOffer === offer.id ? "Selected" : "Select This offer"}

                                    </Button>
                                </Stack>
                            </Paper>
                        })}
                        {
                            selectedOffer !== null ? <Paper withBorder p={"xl"} mt="md">
                                <SelectedOffer offer={(offers || [])?.find(offer => offer.id === selectedOffer)} />
                            </Paper> : null
                        }
                    </Grid.Col>
                </Grid>
            </Container>
        </Layout>
    )
}

export default Winery

const SelectedOffer = ({ offer }: {
    offer: (Offer & {
        OfferTimeSlot: OfferTimeSlot[];
        offer_types: OfferType[];
    }) | undefined
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [selectedTime, setSelectedTime] = useState(new Date())

    const [people, setPeople] = useState(1)
    const [kids, setKids] = useState(0)
    const router = useRouter()
    const { mutate: reserve } = trpc.reservations.reserve.useMutation({
        onSuccess: () => {
            showNotification({
                title: 'Reservation created',
                message: 'Your reservation has been created',
            })
            router.push("/dashboard/reservations")
        }
    })
    if (!offer) {
        return null
    }
    return <Stack spacing={"sm"}>
        <Text>FROM</Text>
        <Title>{`${offer.adult_price} €`} </Title>
        <Text>Per Person</Text>
        <Title order={2}>{`${offer.kid_price} €`} </Title>
        <Text>Per Child</Text>

        <Text>Available Dates</Text>
        <Calendar
            value={selectedDate}
            onChange={(value) => setSelectedDate(value || new Date())}
            fullWidth></Calendar>

        <TimeInput value={selectedTime} onChange={(value) => setSelectedTime(value)} label="Time of Visit" />
        <NumberInput
            placeholder="Number of Adults"
            label="Number of People"
            max={(offer?.max_number_of_people || 0) - kids}
            value={people}
            onChange={(value) => setPeople(value || 1)}
            min={1}
        />
        <NumberInput

            placeholder="Number of Children"
            label="Number of Children"
            max={(offer?.max_number_of_people || 0) - people}
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
                    tourId: "",
                    from_time: (selectedTime.getHours() * 100) + selectedTime.getMinutes(),
                    to_time: (selectedTime.getHours() * 100) + selectedTime.getMinutes(),
                    number_of_people: people,
                    number_of_kids: kids,
                    offerId: offer.id
                })
            }}
            fullWidth>
            Book Now
        </Button>
    </Stack>
}