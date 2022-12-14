import Layout from "@/components/layout/Layout";
import { ProfileCard } from "@/components/profile/ProfileCard";
import YourTours from "@/components/profile/Tours";
import YourWineries from "@/components/profile/Wineries";
import { trpc } from "@/utils/trpc";
import { UserGender } from "@/validation/auth";
import { Button, Container, Grid, Group, SegmentedControl, Stack, Text, Textarea, TextInput, Title, useMantineTheme } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useForm } from "@mantine/form";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons";
import { useSession } from "next-auth/react";
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
const Profile = () => {
    const session = useSession()

    return (
        <Layout>
            <Container >
                <Stack spacing={"md"}>
                    <Title>
                        Your Profile
                    </Title>
                    <ProfileCard />
                    {session.data?.user?.user_type === "WINERY" && <YourWineries />}
                    {session.data?.user?.user_type === "GUIDE" && <YourTours />}
                    <Title order={3}>
                        Reviews
                    </Title>
                </Stack>
            </Container>
        </Layout>
    )
}
export default Profile;