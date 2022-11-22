import type { GetServerSideProps } from "next"
import { getSession } from "next-auth/react";
import Layout from "./Layout"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);
    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    return {
        props: {
            session,
        },
    };
}
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    return (<Layout>
        {children}
    </Layout>
    )
}

export default ProtectedLayout