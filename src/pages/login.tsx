import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";

import { getServerAuthSession } from "@/server/common/get-server-auth-session";

import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Container,
  Space,
} from '@mantine/core';

import { useState } from 'react';
import { ILogin, IRegister, UserType } from "@/validation/auth";
import { LoginType } from "@/components/login/LoginTypes";
import Layout from "@/components/layout/Layout";
import { signIn } from "next-auth/react";
import { SubmitHandler } from "react-hook-form";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";


export function Login(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const [userType, setUserType] = useState<UserType>("TASTER")
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const router = useRouter();
  const mutation = trpc.auth.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => {
      toggle()
      showNotification({
        message: "Please login now.",
        title: "You have successfully registered!",
      })
    },
  });
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },

  });
  const onSubmitLogin: SubmitHandler<ILogin> = async (data) => {
    await signIn("credentials", { ...data, callbackUrl: "/dashboard" });
  };
  const onSubmitRegister: SubmitHandler<IRegister> = async (data) => {
    setErrorMessage(undefined);
    await mutation.mutateAsync(data);
  };
  return (
    <Layout>
      <Container size={"sm"}>
        <Paper radius="md" p="xl" withBorder {...props}>
          <Text size="lg" weight={500}>
            Welcome to Enotourism
          </Text>
          <Space h={"md"} />
          <LoginType type={userType} setType={setUserType} />
          <form onSubmit={form.onSubmit(() => {
            if (type === "login") {
              onSubmitLogin({
                email: form.values.email,
                password: form.values.password,
              })
            }
            if (type === "register") {
              onSubmitRegister({
                email: form.values.email,
                password: form.values.password,
                user_type: userType,
                name: form.values.name,
              })
            }
          })}>
            <Stack>
              {type === 'register' && (
                <TextInput
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                />
              )}

              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Invalid email'}
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && 'Password should include at least 6 characters'}
              />

              {type === 'register' && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                />
              )}
            </Stack>

            <Group position="apart" mt="xl">
              <Anchor
                component="button"
                type="button"
                color="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === 'register'
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </Anchor>
              <Button loading={false} type="submit">{upperFirst(type)}</Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};

export default Login;
