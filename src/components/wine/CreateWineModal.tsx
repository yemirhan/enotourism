import { trpc } from '@/utils/trpc'
import { Button, Grid, Group, Modal, SegmentedControl, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons'
import React from 'react'

export const CreateWineModal = ({ opened, setClosed }: { opened: boolean, setClosed: () => void }) => {
    const { mutate, isLoading } = trpc.userWines.createWine.useMutation({
        onSuccess: () => {
            setClosed()
        },
        onError: (error) => {
            console.error(error)
        }
    })
    const form = useForm<{
        name: string,
        brief_description: string,
        wine_type: {
            color: "red" | "white" | "rose",
            grapes: string,
            name: string,
            taste: string,
            texture: string,
        }
    }>(
        {
            initialValues: {
                name: '',
                brief_description: '',
                wine_type: {
                    color: "red",
                    grapes: "",
                    name: "",
                    taste: "",
                    texture: "",
                }
            }
        }
    )
    return (
        <Modal
            opened={opened}
            onClose={setClosed}
            title='Create Wine'
            size={"lg"}
        >
            <form
                onSubmit={form.onSubmit(() => {
                    mutate(form.values)
                })}
            >
                <Grid>
                    <Grid.Col span={12}>
                        <TextInput
                            label='Name'
                            placeholder='Name'
                            required
                            {...form.getInputProps('name')}

                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Textarea
                            label='Brief Description'
                            placeholder='Brief Description'
                            required
                            {...form.getInputProps('brief_description')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label='Wine Type Name'
                            placeholder='Wine Type Name'
                            required
                            {...form.getInputProps('wine_type.name')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label='Wine Type Grapes'
                            placeholder='Wine Type Grapes'
                            required
                            {...form.getInputProps('wine_type.grapes')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label='Wine Type Texture'
                            placeholder='Wine Type Texture'
                            required
                            {...form.getInputProps('wine_type.texture')}
                        />
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <TextInput
                            label='Wine Type Taste'
                            placeholder='Wine Type Taste'
                            required
                            {...form.getInputProps('wine_type.taste')}
                        />
                    </Grid.Col>
                    <Grid.Col span={12}>
                        <Text size={"sm"} weight={"500"}>
                            Wine  Color
                        </Text>
                        <SegmentedControl
                            value={form.values.wine_type.color}
                            color='wine'

                            onChange={(e) => form.setFieldValue('wine_type.color', e)}
                            fullWidth
                            data={[
                                { label: 'Red', value: 'red' },
                                { label: 'White', value: 'white' },
                                { label: 'Rose', value: 'rose' },

                            ]}
                        />
                    </Grid.Col>

                </Grid>
                <Group position='right' mt={"md"}>
                    <Button
                    type='submit'
                    leftIcon={<IconPlus size={18} />} loading={isLoading}>
                        Create
                    </Button>
                </Group>
            </form>
        </Modal >
    )
}
