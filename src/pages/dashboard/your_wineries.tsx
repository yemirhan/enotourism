import Layout from '@/components/layout/Layout'
import { WineryTable } from '@/components/userWineries/WineryTable'
import { trpc } from '@/utils/trpc'
import { ICreateWinery, IWine } from '@/validation/auth'
import { Button, Container, Grid, Group, Image, Loader, Modal, Paper, SegmentedControl, Select, SimpleGrid, Stack, Stepper, Text, Textarea, TextInput, Title, useMantineTheme } from '@mantine/core'
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { showNotification } from '@mantine/notifications'
import { WineNameList, WineTypes } from '@prisma/client'
import { IconArrowLeft, IconArrowRight, IconBarrel, IconPhoto, IconUpload, IconX } from '@tabler/icons'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import { v4 } from "uuid";

const YourWineries = () => {
    const { data: wineries, isLoading } = trpc.userWinery.getWineriesOfUser.useQuery()
    const [opened, { close, open }] = useDisclosure(false)
    console.log(wineries);

    return (
        <Layout>
            <Container>
                <Stack>
                    <Group position='apart'>
                        <Title>
                            Your Wineries
                        </Title>
                        <Button
                            onClick={open}
                            leftIcon={<IconBarrel size={20} />}>
                            Add Winery
                        </Button>
                    </Group>
                    <WineryTable data={(wineries || []).map(d => ({
                        name: d.name,
                        email: d.email,
                        company: d.description,
                    }))} />
                </Stack>
            </Container>
            <AddWineryModal opened={opened} close={close} />
        </Layout>
    )
}

export default YourWineries

const AddWineryModal = ({ opened, close }: { opened: boolean, close: () => void }) => {
    const router = useRouter()
    const theme = useMantineTheme();
    const context = trpc.useContext()
    const { mutate, isLoading } = trpc.userWinery.createWinery.useMutation({
        onError: () => {
            showNotification({
                title: "Error",
                message: "Something went wrong",
            })
        },
        onSuccess: () => {
            context.userWinery.getWineriesOfUser.invalidate()
            showNotification({
                title: "Success",
                message: "Winery added",
            })
            close()

        }
    })
    const { data: countries } = trpc.countries.getCountries.useQuery()
    const [active, setActive] = useState(0);
    const nextStep = () => setActive((current) => (current < 2 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
    const [photos, setPhotos] = useState<string[]>([])
    const previews = photos.map((file, index) => {
        return (
            <Image
                key={index}
                alt="Preview"
                src={file}
            />
        );
    });
    const form = useForm<ICreateWinery>({
        initialValues: {
            name: "",
            description: "",
            countryId: "",
            email: "",
            history: "",
            awards: "",
            wines: [],
            photos: [],
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => (val.length <= 6 ? 'Name should include at least 6 characters' : null),
        }
    });
    const wineForm = useForm<IWine>({
        initialValues: {
            name: "",
            brief_description: "",
            wine_type: {
                color: "red",
                type: "Albarino",
                name: "",
                taste: "",
                texture: "SMOOTH",
            }
        }
    })
    return <Modal
        opened={opened}
        onClose={close}
        overlayOpacity={0.55}
        overlayBlur={3}
        size="90%"
        title="Create a new winery"

    >
        <Stepper active={active} onStepClick={setActive} breakpoint="sm">
            <Stepper.Step label="First step" description="Enter Winery Details">
                <Grid>
                    <Grid.Col span={12}>
                        <Dropzone
                            onDrop={async (files) => {
                                const f = await files?.[0]?.arrayBuffer()

                                if (f) {

                                    const imageRef = ref(storage, `images/${v4()}`);
                                    uploadBytes(imageRef, f).then((snapshot) => {
                                        getDownloadURL(snapshot.ref).then((url) => {
                                            setPhotos(p => [...p, url])
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
                    <Grid.Col span={4}>
                        <TextInput
                            label='Winery Name'
                            placeholder='Winery Name'
                            required
                            value={form.values.name}
                            {...form.getInputProps('name')}
                            onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <TextInput
                            label='E-Mail'
                            placeholder='E-Mail'
                            required
                            value={form.values.email}
                            {...form.getInputProps('email')}

                            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Select
                            label='Country'
                            placeholder='Country'
                            required
                            value={form.values.countryId}
                            data={
                                (countries || []).map(c => ({ value: c.id, label: c.name }))
                            }

                            onChange={(event) => form.setFieldValue('countryId', event || "")}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Textarea
                            label='Description'
                            placeholder='Description'
                            required
                            rows={6}
                            minRows={6}
                            autosize
                            value={form.values.description}
                            onChange={(event) => form.setFieldValue('description', event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Textarea
                            label='History'
                            placeholder='History'
                            required
                            rows={6}
                            minRows={6}
                            autosize
                            value={form.values.history}
                            onChange={(event) => form.setFieldValue('history', event.currentTarget.value)}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Textarea
                            label='Awards'
                            placeholder='Awards'
                            required
                            rows={6}
                            minRows={6}
                            autosize
                            value={form.values.awards}
                            onChange={(event) => form.setFieldValue('awards', event.currentTarget.value)}
                        />
                    </Grid.Col>
                </Grid>
            </Stepper.Step>
            <Stepper.Step label="Second step" description="Add wines">
                <Grid h={600}>
                    <Grid.Col span={6}>
                        {form.values.wines.map((wine, index) => {
                            return <Paper key={index} withBorder p={"sm"}>
                                <Stack>
                                    <Title order={3}>
                                        {wine.name}
                                    </Title>
                                    <Text>
                                        {wine.brief_description}
                                    </Text>
                                    <Text>
                                        {wine.wine_type.color}
                                    </Text>
                                </Stack>

                            </Paper>
                        })}
                    </Grid.Col>
                    <Grid.Col span={6}>

                        <Grid>
                            <Grid.Col span={12}>
                                <TextInput
                                    label='Name'
                                    placeholder='Name'
                                    {...wineForm.getInputProps('name')}

                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea
                                    label='Brief Description'
                                    placeholder='Brief Description'
                                    {...wineForm.getInputProps('brief_description')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label='Wine Type'
                                    data={Object.values(WineNameList)}
                                    placeholder='Wine Type'
                                    {...wineForm.getInputProps('wine_type.type')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label='Wine Texture'
                                    data={Object.values(WineTypes)}
                                    placeholder='Wine Texture'
                                    {...wineForm.getInputProps('wine_type.texture')}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Wine Taste'
                                    placeholder='Wine Taste'
                                    {...wineForm.getInputProps('wine_type.taste')}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Text size={"sm"} weight={"500"}>
                                    Wine  Color
                                </Text>
                                <SegmentedControl
                                    value={wineForm.values.wine_type.color}
                                    color='wine'

                                    onChange={(e) => wineForm.setFieldValue('wine_type.color', e)}
                                    fullWidth
                                    data={[
                                        { label: 'Red', value: 'red' },
                                        { label: 'White', value: 'white' },
                                        { label: 'Rose', value: 'rose' },

                                    ]}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Button onClick={() => {
                                    form.setFieldValue('wines', [...form.values.wines, wineForm.values])
                                    wineForm.reset()
                                }} fullWidth>
                                    Add Wine
                                </Button>
                            </Grid.Col>
                        </Grid>
                    </Grid.Col>
                </Grid>
            </Stepper.Step>

        </Stepper>


        <Group position='right' mt={"lg"}>
            {
                active === 0 ? <Button
                    leftIcon={<IconArrowRight size={20} />}
                    onClick={nextStep}>
                    Next Step
                </Button>
                    : <>
                        <Button
                            leftIcon={<IconArrowLeft size={20} />}
                            onClick={prevStep}>
                            Back
                        </Button>
                        <Button onClick={() => {
                            mutate({
                                ...form.values,
                                photos: photos
                            })
                        }} leftIcon={<IconBarrel size={20} />} disabled={!form.isDirty()} loading={isLoading}>
                            Create Winery
                        </Button>
                    </>
            }
        </Group>

    </Modal>
}