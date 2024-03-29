import Layout from "@/components/layout/Layout";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { supabase } from "@/utils/supabaseClient";
import { trpc } from "@/utils/trpc";
import { UserGender } from "@/validation/auth";
import { Button, Container, Grid, Group, SegmentedControl, Stack, Text, Textarea, TextInput, Title, useMantineTheme } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from "@/utils/firebase";
import { v4 } from "uuid";
import type { GetServerSideProps } from 'next';
import { getServerAuthSession } from '@/server/common/get-server-auth-session';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerAuthSession({
        req: context.req,
        res: context.res,
    });

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false,
            },
        };
    }

    return { props: {} };
};

export type UpdateProfile = {
    name: string,
    surname: string,
    gender: UserGender,
    phone_number: string,
    photo: string,
    about: string
}
const UpdateProfile = () => {
    const { data: user, isLoading: isUserLoading, refetch } = trpc.profile.getProfile.useQuery()
    const { mutate, isLoading } = trpc.profile.updateProfile.useMutation({
        onSuccess: () => {
            showNotification({
                title: "Success",
                message: "Profile updated successfully",
            })
        },
        onError: () => {
            showNotification({
                title: "Error",
                message: "Something went wrong",
            })
        }
    })

    const theme = useMantineTheme();
    const form = useForm<UpdateProfile>({
        initialValues: {
            name: "",
            surname: "",
            gender: "OTHER",
            phone_number: "",
            about: "",
            photo: ""
        },
    });
    useEffect(() => {
        form.setValues({
            name: user?.name || "",
            surname: user?.surname || "",
            gender: user?.gender || "OTHER",
            phone_number: user?.phone_number || "",
            about: user?.about || "",
            photo: user?.photo || ""
        })
    }, [user])

    if (isUserLoading) return <div>Loading...</div>
    return (
        <Layout>
            <Container>
                <Stack>
                    <Title order={2}>
                        Update Profile Settings
                    </Title>
                    <form onSubmit={form.onSubmit(() => {
                        mutate({
                            ...form.values
                        })
                    })}>
                        <Grid gutter={"md"}>
                            <Grid.Col span={6}>
                                <TextInput
                                    label="Name"
                                    value={form.values.name}
                                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                                    placeholder="Name" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Surname"
                                    value={form.values.surname}
                                    onChange={(event) => form.setFieldValue('surname', event.currentTarget.value)}
                                    placeholder="Surname" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <TextInput label="Phone Number"
                                    value={form.values.phone_number}
                                    onChange={(event) => form.setFieldValue('phone_number', event.currentTarget.value)}
                                    placeholder="+90 (530) 000 00 00" />
                            </Grid.Col>
                            <Grid.Col span={6}>
                                <Stack spacing={0}>
                                    <Text weight={500} size="sm">
                                        Gender
                                    </Text>
                                    <SegmentedControl
                                        fullWidth
                                        value={form.values.gender}
                                        onChange={(e: UserGender) => form.setFieldValue('gender', e)}
                                        data={[
                                            { label: 'Male', value: 'MALE' },
                                            { label: 'Female', value: 'FEMALE' },
                                            { label: 'Other', value: 'OTHER' },

                                        ]}
                                    />
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Textarea label="About"
                                    value={form.values.about}
                                    rows={9}
                                    minRows={9}
                                    autosize
                                    onChange={(event) => form.setFieldValue('about', event.currentTarget.value)}
                                    placeholder="About" />
                            </Grid.Col>

                            <Grid.Col span={12}>
                                <Dropzone
                                    onDrop={async (files) => {
                                        const f = await files?.[0]?.arrayBuffer()

                                        if (f) {

                                            const imageRef = ref(storage, `images/${v4()}`);
                                            uploadBytes(imageRef, f).then((snapshot) => {
                                                getDownloadURL(snapshot.ref).then((url) => {
                                                    form.setFieldValue('photo', url)
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
                            </Grid.Col>
                        </Grid>
                        <Group mt={"lg"} position="right">
                            <Button type="submit" disabled={!form.isDirty()} loading={isLoading}>
                                Update Profile
                            </Button>
                        </Group>
                    </form>
                </Stack>
            </Container>
        </Layout>
    )
}

export default UpdateProfile