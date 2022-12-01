import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { trpc } from '@/utils/trpc'
import { Avatar, Button, Container, Grid, Group, NumberInput, Select, Stack, Text, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconPlus } from '@tabler/icons'
import React, { forwardRef } from 'react'


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
    const { data: wineries } = trpc.wineries.getWineries.useQuery()
    const form = useForm({
        initialValues: {
            name: "",
            description: "",
            number_of_people: 0,
            wineryId: ""
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