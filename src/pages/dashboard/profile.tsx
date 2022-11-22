import Layout from "@/components/layout/Layout";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { trpc } from "@/utils/trpc";
import { UserGender } from "@/validation/auth";
import { Button, Container, Grid, Group, SegmentedControl, Stack, Text, Textarea, TextInput, Title, useMantineTheme } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import { useSession } from "next-auth/react";

export type UpdateProfile = {
    name: string,
    surname: string,
    gender: UserGender,
    phone_number: string,
    photo: string,
    about: string
}
const Profile = () => {
    

    return (
        <Layout>
            <Container >
                <Stack spacing={"md"}>
                    <Title>
                        Your Profile
                    </Title>
                    <ProfileCard />

                </Stack>
            </Container>
        </Layout>
    )
}
export default Profile;