import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { CreateTourInput } from '@/server/trpc/router/userTours'
import { trpc } from '@/utils/trpc'
import { Avatar, Button, Container, Grid, Group, MultiSelect, NumberInput, Select, Stack, Text, Textarea, TextInput, Title, useMantineTheme } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { OfferTypeEnum } from '@prisma/client'
import { IconCheck, IconPhoto, IconPlus, IconUpload, IconX } from '@tabler/icons'
import dayjs from 'dayjs'
import React, { forwardRef } from 'react'

export const TourTypes = {
    "TASTING": "Visit and Tasting",
    "GUIDES": "Wine Guides",
    "EXTRAACTIVITIES": "Extra Activities",
    "ACCOMODATION": "Accomodation",
    "RESTAURANT": "Restaurant"
}
const CreateTour = () => {
    const theme = useMantineTheme();
    const { mutate, isLoading } = trpc.userTours.createTour.useMutation({
        onSuccess() {
            showNotification({
                title: "Success",
                message: "Tour created successfully",
                icon: <IconCheck size={20} />
            })
        },
    })
    const { data: wineries } = trpc.wineries.getWineries.useQuery()
    const form = useForm<CreateTourInput>({
        initialValues: {
            name: "",
            description: "",
            number_of_people: 0,
            wineryId: "",
            adult_price: 0,
            duration: 0,
            kid_price: 0,
            max_number_of_people: 0,
            offer_description: "",
            offer_name: "",
            offerTypes: [],
            price: 0,
            endDate: new Date(),
            startDate: new Date(),
            start_hour: 0,
            end_hour: 0,
            endTime: new Date(),
            startTime: new Date(),
        }

    })
    console.log(form.values);

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
                                <Dropzone
                                    onDrop={(files) => console.log('accepted files', files)}
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
                                <Select
                                    label='Winery'
                                    placeholder='Winery'
                                    required
                                    itemComponent={SelectItem}
                                    value={form.values.wineryId}
                                    data={
                                        (wineries || []).map(winery => {
                                            return {
                                                value: winery.id,
                                                label: winery.name,
                                                country: winery.address?.country,
                                            }
                                        })
                                    }
                                    searchable
                                    filter={(value, item) =>
                                        (item.label || "").toLowerCase().includes(value.toLowerCase().trim())
                                    }
                                    onChange={(event) => form.setFieldValue('wineryId', event || "")}
                                />

                            </Grid.Col>

                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Number of People'
                                    placeholder='Number of People'
                                    required
                                    value={form.values.number_of_people}
                                    {...form.getInputProps('number_of_people')}
                                    onChange={(event) => form.setFieldValue('number_of_people', event || 0)}
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
                                    label='Duration'
                                    placeholder='Duration'
                                    required
                                    value={form.values.duration}
                                    {...form.getInputProps('duration')}
                                    onChange={(event) => form.setFieldValue('duration', event || 0)}
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
                                    value={form.values.max_number_of_people}
                                    {...form.getInputProps('max_number_of_people')}
                                    onChange={(event) => form.setFieldValue('max_number_of_people', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <MultiSelect
                                    label='Tour Type'
                                    placeholder='Tour Type'
                                    required
                                    itemComponent={SelectItem}
                                    value={form.values.offerTypes}
                                    data={
                                        (Object.entries(OfferTypeEnum)).map((tourType, k) => {
                                            return {
                                                label: TourTypes[tourType[1]],
                                                value: tourType[1],
                                            }
                                        })
                                    }
                                    searchable

                                    onChange={(event: any) => form.setFieldValue('offerTypes', event || [])}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <DatePicker
                                    label='Offer Start Date'
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
                                    label='Offer End Date'
                                    placeholder='End Date'
                                    required
                                    value={form.values.endDate}
                                    {...form.getInputProps('endDate')}
                                    onChange={(event) => form.setFieldValue('endDate', event || new Date())}
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Price'
                                    placeholder='Price'
                                    required
                                    value={form.values.price}
                                    {...form.getInputProps('price')}
                                    onChange={(event) => form.setFieldValue('price', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    label='Number of People'
                                    placeholder='Number of People'
                                    required
                                    value={form.values.number_of_people}
                                    {...form.getInputProps('number_of_people')}
                                    onChange={(event) => form.setFieldValue('number_of_people', event || 0)}
                                />
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