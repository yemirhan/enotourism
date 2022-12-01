import ProtectedLayout from '@/components/layout/ProtectedLayout'
import { trpc } from '@/utils/trpc';
import type { IAddress } from '@/validation/address';
import { Button, Checkbox, Container, Grid, Group, Select, Stack, Textarea, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';

import { IconCheck, IconDeviceFloppy, IconExclamationMark } from '@tabler/icons';
import React, { useEffect, useState } from 'react'

const Address = () => {
    const { data: address } = trpc.address.getAddress.useQuery();
    const { data: countries } = trpc.countries.getCountries.useQuery()
    const { mutate, isLoading } = trpc.address.createOrUpdateAddress.useMutation({
        onError(error, variables, context) {
            showNotification({
                title: "Error",
                message: error.message,
                icon: <IconExclamationMark size={20} />
            })
        },
        onSuccess() {
            showNotification({
                title: "Success",
                message: "Address saved successfully",
                icon: <IconCheck size={20} />
            })
        }
    });
    const [searchValue, onSearchChange] = useState('');
    const form = useForm<IAddress>({
        initialValues: {
            street: "",
            city: "",
            flat: "",
            address: "",
            is_contact_address: false,
            postcode: "",
            countryId: "",
        },
    });
    useEffect(() => {
        if (address) {
            form.setValues(address)
        }
    }, [address])

    return (
        <ProtectedLayout>
            <Container>
                <Stack>
                    <Group>
                        <Title>Address Details</Title>
                    </Group>
                    <form
                        onSubmit={form.onSubmit(() => {
                            mutate({
                                ...form.values
                            })
                        })}
                    >
                        <Grid>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Street'
                                    placeholder='Street'
                                    required
                                    value={form.values.street}
                                    {...form.getInputProps('street')}
                                    onChange={(event) => form.setFieldValue('street', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='City'
                                    placeholder='City'
                                    required
                                    value={form.values.city}
                                    {...form.getInputProps('city')}
                                    onChange={(event) => form.setFieldValue('city', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Flat'
                                    placeholder='Flat'
                                    required
                                    value={form.values.flat}
                                    {...form.getInputProps('flat')}
                                    onChange={(event) => form.setFieldValue('flat', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={12}>
                                <Textarea
                                    label='Address'
                                    placeholder='Address'
                                    required
                                    value={form.values.address}
                                    {...form.getInputProps('address')}
                                    onChange={(event) => form.setFieldValue('address', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput
                                    label='Postcode'
                                    placeholder='Postcode'
                                    value={form.values.postcode}
                                    {...form.getInputProps('postcode')}
                                    onChange={(event) => form.setFieldValue('postcode', event.currentTarget.value)}
                                />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Select
                                    label='Country'
                                    placeholder='Country'
                                    searchable
                                    onSearchChange={onSearchChange}
                                    searchValue={searchValue}

                                    nothingFound="No countries found"
                                    required
                                    value={form.values.countryId}
                                    data={(countries || []).map(country => ({ value: country.id, label: country.name }))}
                                    {...form.getInputProps('country')}
                                    onChange={(event) => form.setFieldValue('countryId', event || "")}
                                />
                            </Grid.Col>
                        </Grid>
                        <Group mt={"md"} position='apart'>
                            <Checkbox
                                checked={form.values.is_contact_address}
                                onChange={(event) => form.setFieldValue('is_contact_address', event.target.checked)}
                                label='Is Contact Address' />
                            <Button
                                loading={isLoading}
                                disabled={!form.isDirty()}
                                type='submit'
                                leftIcon={<IconDeviceFloppy size={20} />}
                            >
                                Update Address Details
                            </Button>
                        </Group>
                    </form>
                </Stack>
            </Container>
        </ProtectedLayout>
    )
}

export default Address