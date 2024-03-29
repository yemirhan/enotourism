import { useState } from 'react';
import { createStyles, Table, ScrollArea } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    header: {
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'box-shadow 150ms ease',

        '&::after': {
            content: '""',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            borderBottom: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[2]
                }`,
        },
    },

    scrolled: {
        boxShadow: theme.shadows.sm,
    },
}));

interface TableScrollAreaProps {
    data: { name: string; number_of_people: number; description: string }[];
}

export function UserToursList({ data }: TableScrollAreaProps) {
    const { classes, cx } = useStyles();
    const [scrolled, setScrolled] = useState(false);

    const rows = data.map((row) => (
        <tr key={row.name}>
            <td>{row.name}</td>
            <td>{row.number_of_people}</td>
            <td>{row.description}</td>
        </tr>
    ));

    return (
        <ScrollArea sx={{ height: 300 }} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table sx={{ minWidth: 700 }}>
                <thead className={cx(classes.header, { [classes.scrolled]: scrolled })}>
                    <tr>
                        <th>Tour Name</th>
                        <th>Number Of People</th>
                        <th>Tour Description</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}