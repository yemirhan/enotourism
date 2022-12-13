import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { CreateTourInput } from '@/server/trpc/router/userTours'
import { trpc } from '@/utils/trpc'
import { Avatar, Button, Container, Grid, Group, Image, MultiSelect, NumberInput, Select, SimpleGrid, Stack, Text, Textarea, TextInput, Title, useMantineTheme } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { OfferTypeEnum } from '@prisma/client'
import { IconCheck, IconPhoto, IconPlus, IconUpload, IconX } from '@tabler/icons'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import React, { forwardRef, useState } from 'react'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import { v4 } from "uuid";
export const TourTypes = {
    "TASTING": "Visit and Tasting",
    "GUIDES": "Wine Guides",
    "EXTRAACTIVITIES": "Extra Activities",
    "ACCOMODATION": "Accomodation",
    "RESTAURANT": "Restaurant",
    CHEESE: "Wine Tasting with Cheese",
    WINEMAKING: "Wine Making",
    WORKSHOPS: "Workshops",
    SIGHTSEEING: "Sightseeing",
    WINELECTURE: "Wine Lectures",
}
const CreateTour = () => {
    const theme = useMantineTheme();
    const router = useRouter()
    const { mutate, isLoading } = trpc.userTours.createTour.useMutation({
        onSuccess() {
            showNotification({
                title: "Success",
                message: "Tour created successfully, redirecting to tours page...",
                icon: <IconCheck size={20} />,
                autoClose: 3000,
            })
            setTimeout(() => {
                router.push("/dashboard/tours")
            }, 3000);
        },
    })

    const [countrySearch, setCountrySearch] = useState("")
    const { data: wineries } = trpc.wineries.getWineries.useQuery()
    const { data: countries } = trpc.countries.getCountries.useQuery()
    const form = useForm<CreateTourInput>({
        initialValues: {
            description: "",
            name: "",
            number_of_people: 0,
            startDate: new Date(),
            endDate: new Date(),
            startTime: new Date(),
            selected_all_price: 0,
            adult_price: 0,
            kid_price: 0,
            photos: [],
            activities: [],
            wineryIds: [],
            address: {
                city: "",
                countryId: "",
                street: "",
                flat: "",
            }
        }

    })
    const previews = form.values.photos.map((file, index) => {
        return (
            <Image
                key={index}
                alt="Preview"
                src={file}
            />
        );
    });
    return (
        <ProtectedLayout>
            <Container>
                <Stack>
                    <Title>
                        Create Tour
                    </Title>
                    <form onSubmit={form.onSubmit(() => {
                        mutate({
                            ...form.values
                        })
                    })}>
                        <Grid>
                            <Grid.Col span={12}>
                                <Title order={3}>
                                    Cover Details
                                </Title>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Dropzone
                                    onDrop={async (files) => {
                                        const f = await files?.[0]?.arrayBuffer()

                                        if (f) {

                                            const imageRef = ref(storage, `images/${v4()}`);
                                            uploadBytes(imageRef, f).then((snapshot) => {
                                                getDownloadURL(snapshot.ref).then((url) => {
                                                    form.setFieldValue('photos', [...form.values.photos, url])
                                                });
                                            });
                                        }
                                    }}
                                    onReject={(files) => console.log('rejected files', files)}
                                    maxSize={3 * 1024 ** 2}
                                    accept={IMAGE_MIME_TYPE}
                                >
                                    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
                                        <Dropzone.Accept>
                                            <IconUpload
                                                size={50}
                                                stroke={1.5}
                                                color={theme?.colors?.[theme?.primaryColor]?.[theme.colorScheme === 'dark' ? 4 : 6]}
                                            />
                                        </Dropzone.Accept>
                                        <Dropzone.Reject>
                                            <IconX
                                                size={50}
                                                stroke={1.5}
                                                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                            />
                                        </Dropzone.Reject>
                                        <Dropzone.Idle>
                                            <IconPhoto size={50} stroke={1.5} />
                                        </Dropzone.Idle>

                                        <div>
                                            <Text size="xl" inline>
                                                Drag images here or click to select files
                                            </Text>
                                            <Text size="sm" color="dimmed" inline mt={7}>
                                                Attach as many files as you like, each file should not exceed 5mb
                                            </Text>
                                        </div>
                                    </Group>
                                </Dropzone>
                                <SimpleGrid
                                    cols={4}
                                    breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
                                    mt={previews.length > 0 ? 'xl' : 0}
                                >
                                    {previews}
                                </SimpleGrid>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Tour Name'
                                    placeholder='Tour Name'
                                    required
                                    value={form.values.name}
                                    {...form.getInputProps('name')}
                                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                                />

                            </Grid.Col>
                            <Grid.Col span={6}>
                                <MultiSelect
                                    label='Winery'
                                    placeholder='Winery'
                                    required

                                    value={form.values.wineryIds}
                                    data={
                                        (wineries || []).map(winery => {
                                            return {
                                                value: winery.id,
                                                label: winery.name,
                                            }
                                        })
                                    }
                                    searchable
                                    onSearchChange={(value) => setCountrySearch(value)}
                                    filter={(value, item) =>
                                        (countrySearch).toLowerCase().includes(value.toLowerCase().trim())
                                    }
                                    onChange={(event) => form.setFieldValue('wineryIds', event)}
                                />

                            </Grid.Col>
                            <Grid.Col span={6}>
                                <MultiSelect
                                    label='Tour Type'
                                    placeholder='Tour Type'
                                    required
                                    itemComponent={SelectItem}
                                    value={form.values.activities}
                                    data={
                                        (Object.entries(OfferTypeEnum)).map((tourType, k) => {
                                            return {
                                                label: TourTypes[tourType[1]],
                                                value: tourType[1],
                                            }
                                        })
                                    }
                                    searchable
                                    onChange={(event: OfferTypeEnum[]) => form.setFieldValue('activities', event || [])}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea
                                    label='Description'
                                    placeholder='Description'
                                    required
                                    rows={9}
                                    minRows={9}
                                    autosize
                                    value={form.values.description}
                                    onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Title order={3}>
                                    Pricing and Availability
                                </Title>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Book All Price'
                                    placeholder='Book All Price'
                                    required
                                    value={form.values.selected_all_price}
                                    {...form.getInputProps('selected_all_price')}
                                    onChange={(event) => form.setFieldValue('selected_all_price', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Adult Price'
                                    placeholder='Adult Price'
                                    required
                                    value={form.values.adult_price}
                                    {...form.getInputProps('adult_price')}
                                    onChange={(event) => form.setFieldValue('adult_price', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Kid Price'
                                    placeholder='Kid Price'
                                    required
                                    value={form.values.kid_price}
                                    {...form.getInputProps('kid_price')}
                                    onChange={(event) => form.setFieldValue('kid_price', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Max Number of People'
                                    placeholder='Max Number of People'
                                    required
                                    value={form.values.number_of_people}
                                    {...form.getInputProps('number_of_people')}
                                    onChange={(event) => form.setFieldValue('number_of_people', event || 0)}
                                />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Title order={3}>
                                    Tour Dates
                                </Title>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TimeInput
                                    label='Starts At'
                                    placeholder='Starts At'
                                    required
                                    value={form.values.startTime}
                                    {...form.getInputProps('startTime')}
                                    onChange={(event) => form.setFieldValue('startTime', event || 0)}
                                />
                            </Grid.Col>



                            <Grid.Col span={6}>
                                <DatePicker
                                    label='Tour Start Date'
                                    placeholder='Start Date'
                                    required
                                    minDate={dayjs(new Date()).subtract(1, 'day').toDate()}
                                    value={form.values.startDate}
                                    {...form.getInputProps('startDate')}
                                    onChange={(event) => form.setFieldValue('startDate', event || new Date())}
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <DatePicker
                                    label='Tour End Date'
                                    placeholder='End Date'
                                    required
                                    value={form.values.endDate}
                                    {...form.getInputProps('endDate')}
                                    onChange={(event) => form.setFieldValue('endDate', event || new Date())}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Title order={3}>
                                    Address and Location
                                </Title>
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label='Country'
                                    placeholder='Country'
                                    required
                                    value={form.values.address.countryId}
                                    data={
                                        (countries || []).map(c => ({ value: c.id, label: c.name }))
                                    }

                                    onChange={(event) => form.setFieldValue('address.countryId', event || "")}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='City'
                                    placeholder='City'
                                    required
                                    value={form.values.address.city}
                                    {...form.getInputProps('address.city')}
                                    onChange={(event) => form.setFieldValue('address.city', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Flat'
                                    placeholder='Flat'
                                    required
                                    value={form.values.address.flat}
                                    {...form.getInputProps('address.flat')}
                                    onChange={(event) => form.setFieldValue('address.flat', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Street'
                                    placeholder='Street'
                                    required
                                    value={form.values.address.street}
                                    {...form.getInputProps('address.street')}
                                    onChange={(event) => form.setFieldValue('address.street', event.currentTarget.value)}
                                />
                            </Grid.Col>







                        </Grid>
                        <Group mt={"lg"} position='right'>
                            <Button leftIcon={<IconPlus size={18} />} type='submit' loading={isLoading}>
                                Create Tour
                            </Button>
                        </Group>
                    </form>
                </Stack>
            </Container>
        </ProtectedLayout>
    )
}

export default CreateTour


interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    wineryId: string,
    label: string,
    country: string,
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ label, country, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        {country}
                    </Text>
                </div>
            </Group>
        </div>
    )
);
SelectItem.displayName = '@mantine/core/SelectItem';