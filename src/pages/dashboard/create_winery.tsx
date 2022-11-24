import Layout from '@/components/layout/Layout'
import { trpc } from '@/utils/trpc'
import { ICreateWinery } from '@/validation/auth'
import { Button, Container, Grid, Group, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { IconBarrel } from '@tabler/icons'
import { useRouter } from 'next/router'
import React from 'react'


const CreateWinery = () => {
    const router = useRouter()
    const { mutate, isLoading } = trpc.userWinery.createWinery.useMutation({
        onError: () => {
            showNotification({
                title: "Error",
                message: "Something went wrong",
            })
        },
        onSuccess: () => {
            router.push("/dashboard/your_wineries")
        }
    })
    const form = useForm<ICreateWinery>({
        initialValues: {
            name: "",
            description: "",
            email: "",
            history: "",
            awards: ""
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            name: (val) => (val.length <= 6 ? 'Name should include at least 6 characters' : null),
        }
    });
    return (
        <Layout>
            <Container>
                <Stack>
                    <Group position='apart'>
                        <Title>
                            Create Winery
                        </Title>
                    </Group>
                    <form onSubmit={form.onSubmit(() => {
                        mutate({
                            ...form.values
                        })
                    })}>
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Winery Name'
                                    placeholder='Winery Name'
                                    required
                                    value={form.values.name}
                                    {...form.getInputProps('name')}
                                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='E-Mail'
                                    placeholder='E-Mail'
                                    required
                                    value={form.values.email}
                                    {...form.getInputProps('email')}

                                    onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
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
                            <Grid.Col span={12}>
                                <Textarea
                                    label='History'
                                    placeholder='History'
                                    required
                                    rows={9}
                                    minRows={9}
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
                                    rows={9}
                                    minRows={9}
                                    autosize
                                    value={form.values.awards}
                                    onChange={(event) => form.setFieldValue('awards', event.currentTarget.value)}
                                />
                            </Grid.Col>
                        </Grid>
                        <Group position='right' mt={"lg"}>
                            <Button type='submit' leftIcon={<IconBarrel size={20} />} disabled={!form.isDirty()} loading={isLoading}>
                                Create Winery
                            </Button>
                        </Group>
                    </form>
                </Stack>
            </Container>
        </Layout>
    )
}

export default CreateWinery