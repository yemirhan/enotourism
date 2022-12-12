import Layout from '@/components/layout/Layout'
import { CreateOfferInputs } from '@/server/trpc/router/offer'
import { trpc } from '@/utils/trpc'
import { Button, Checkbox, Container, Grid, Group, Image, MultiSelect, NumberInput, Select, SimpleGrid, Stack, Text, Textarea, TextInput, Title, useMantineTheme } from '@mantine/core'
import { DatePicker, TimeInput } from '@mantine/dates'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { OfferTypeEnum } from '@prisma/client'
import { IconCashBanknote, IconClock, IconPhoto, IconPlus, IconUpload, IconUsers, IconX } from '@tabler/icons'
import dayjs from 'dayjs'
import React, { forwardRef } from 'react'
import { TourTypes } from './create_tour'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import { v4 } from "uuid";

const CreateOffer = () => {
    const theme = useMantineTheme();
    const { mutate: createOffer, isLoading } = trpc.offer.createOffer.useMutation()
    const { data: wineries } = trpc.userWinery.getWineriesOfUser.useQuery()
    const form = useForm<CreateOfferInputs>({
        initialValues: {
            name: "",
            date: new Date(),
            startsAt: new Date(),
            duration: 1,
            adult_price: 0,
            kid_price: 0,
            kids_allowed: true,
            max_number_of_people: 10,
            wineryId: "",
            description: "",
            photos: [],
            offerType: OfferTypeEnum.RESTAURANT
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
        <Layout>
            <Container>
                <Stack>
                    <Group>
                        <Title>
                            Create Offer
                        </Title>
                    </Group>
                    <form onSubmit={form.onSubmit(() => {
                        createOffer({
                            ...form.values
                        })
                    })}>
                        <Grid>
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
                                    label='Offer Name'
                                    placeholder='Offer Name'
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
                                    icon={<IconClock size={20} />}
                                    label='Duration'
                                    step={0.25}
                                    precision={2}
                                    min={0.5}
                                    placeholder='Duration'
                                    required
                                    value={form.values.duration}
                                    {...form.getInputProps('duration')}
                                    onChange={(event) => form.setFieldValue('duration', event || 0)}
                                />
                            </Grid.Col>

                            <Grid.Col span={6}>
                                <NumberInput
                                    icon={<IconCashBanknote size={18} />}
                                    label='Adult Price'
                                    placeholder='Adult Price'
                                    required
                                    value={form.values.adult_price}
                                    {...form.getInputProps('adult_price')}
                                    onChange={(event) => form.setFieldValue('adult_price', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Checkbox
                                    label='Kids Allowed'
                                    checked={form.values.kids_allowed}
                                    {...form.getInputProps('kids_allowed')}
                                    onChange={(event) => form.setFieldValue('kids_allowed', event.currentTarget.checked)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <NumberInput
                                    icon={<IconCashBanknote size={18} />}
                                    label='Kid Price'
                                    placeholder='Kid Price'
                                    disabled={!form.values.kids_allowed}
                                    value={form.values.kid_price}
                                    {...form.getInputProps('kid_price')}
                                    onChange={(event) => form.setFieldValue('kid_price', event || 0)}
                                />
                            </Grid.Col>


                            <Grid.Col span={6}>
                                <NumberInput
                                    icon={<IconUsers size={18} />}
                                    label='Max Number of People'
                                    placeholder='Max Number of People'
                                    required
                                    value={form.values.max_number_of_people}
                                    {...form.getInputProps('max_number_of_people')}
                                    onChange={(event) => form.setFieldValue('max_number_of_people', event || 0)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label='Offer Type'
                                    placeholder='Offer Type'
                                    required
                                    itemComponent={SelectItem}
                                    value={form.values.offerType}
                                    data={
                                        (Object.entries(OfferTypeEnum)).map((tourType, k) => {
                                            return {
                                                label: TourTypes[tourType[1]],
                                                value: tourType[1],
                                            }
                                        })
                                    }
                                    searchable

                                    onChange={(event: any) => form.setFieldValue('offerType', event)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TimeInput
                                    label='Offer Starts At'
                                    placeholder='Offer Starts At'
                                    required

                                    value={form.values.startsAt}
                                    {...form.getInputProps('startsAt')}
                                    onChange={(event) => form.setFieldValue('startsAt', event || new Date())}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <DatePicker
                                    label='Offer Date'
                                    placeholder='Offer Date'
                                    minDate={dayjs(new Date()).subtract(1, 'day').toDate()}
                                    required
                                    value={form.values.date}
                                    {...form.getInputProps('date')}
                                    onChange={(event) => form.setFieldValue('date', event || new Date())}
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
                                Create Offer
                            </Button>
                        </Group>
                    </form>
                </Stack>
            </Container>
        </Layout>
    )
}

export default CreateOffer

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