import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { trpc } from '@/utils/trpc'
import { Button, Container, Grid, Group, NumberInput, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconPlus } from '@tabler/icons'
import React from 'react'


const CreateTour = () => {
    const { mutate, isLoading } = trpc.userTours.createTour.useMutation({
        onSuccess() {
            showNotification({
                title: "Success",
                message: "Tour created successfully",
                icon: <IconCheck size={20} />
            })
        },
    })
    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            number_of_people: 0,
        }

    })
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