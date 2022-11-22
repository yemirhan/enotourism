import { UserType } from '@/validation/auth';
import { UnstyledButton, Checkbox, Text, Image, SimpleGrid, createStyles } from '@mantine/core';
import { IconArrowGuide, IconBarrel, IconBottle } from '@tabler/icons';


const useStyles = createStyles((theme, { checked }: { checked: boolean }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        border: `1px solid ${checked
            ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[3]
            }`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        backgroundColor: checked
            ? theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.white,
    },

    body: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
}));

interface ImageCheckboxProps {
    defaultChecked?: boolean;
    onChange(checked: string): void;
    title: string;
    type: string;
    icon: React.ReactNode;
    checked: string;

}

export function ImageCheckbox({
    checked,
    defaultChecked,
    onChange,
    title,
    type,
    className,
    icon,
    ...others
}: ImageCheckboxProps & Omit<React.ComponentPropsWithoutRef<'button'>, keyof ImageCheckboxProps>) {


    const { classes, cx } = useStyles({ checked: type === checked });

    return (
        <UnstyledButton
            {...others}
            onClick={() => onChange(type)}
            className={cx(classes.button, className)}
        >
            {icon}

            <div className={classes.body}>

                <Text weight={500} size="sm" sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
            </div>

            <Checkbox
                checked={type === checked}
                onChange={() => onChange(type)}
                tabIndex={-1}
                styles={{ input: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}

const mockdata = [
    { type: 'TASTER', title: 'Wine Taster', icon: <IconBottle size={24} /> },
    { type: 'WINERY', title: 'Winery', icon: <IconBarrel size={24} /> },
    { type: 'GUIDE', title: 'Wine Guide', icon: <IconArrowGuide size={24} /> },
];

export function LoginType({ type, setType }: { type: UserType, setType: (type: UserType) => void }) {
    const items = mockdata.map((item) => <ImageCheckbox {...item} checked={type} onChange={setType} key={item.title} />);
    return (
        <SimpleGrid
        mb={"lg"}
            cols={3}
            breakpoints={[
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'sm', cols: 1 },
            ]}
        >
            {items}
        </SimpleGrid>
    );
}