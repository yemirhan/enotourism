import { trpc } from '@/utils/trpc'
import { Button, Group, MultiSelect, Paper, Select, TextInput } from '@mantine/core'
import { WineTypes, OfferTypeEnum } from '@prisma/client'
import { IconActivity, IconMapPin, IconSearch } from '@tabler/icons'
import React from 'react'
const data = [
    "Albania",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Belgium",
    "Bolivia",
    "Bosnia-Herzegovina",
    "Brazil",
    "Bulgaria",
    "Canada",
    "Chile",
    "China",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Israel",
    "Italy",
    "Kazakhstan",
    "Latvia",
    "Lebanon",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Mexico",
    "Moldova",
    "Montenegro",
    "Morocco",
    "Namibia",
    "Netherlands",
    "New Zealand",
    "Northern Macedonia",
    "Peru",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "Spain",
    "Sweden",
    "Switzerland",
    "Thailand",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    "Uruguay",
    "USA",
    "Uzbekistan",
    "Vietnam"
]


export const GuideSearch = ({
    search,
    setSearch,
    setCountryId,
}: {
    search: string
    setSearch: (search: string) => void
    setCountryId: (countryId: string) => void,
}) => {
    const { data: countries } = trpc.countries.getCountries.useQuery()
    return (
        <Paper withBorder p={"md"} >
            <Group grow spacing={"lg"}>
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Guide Name' icon={<IconSearch size={18} />} />
                <Select
                    data={(countries || []).map(country => ({ value: country.id, label: country.name }))}
                    searchable
                    icon={<IconMapPin size={18} />}
                    placeholder="Location"
                    onChange={(e) => setCountryId(e || "")}
                />
                <Button leftIcon={<IconSearch size={18} />}>
                    Search
                </Button>
            </Group>
        </Paper>
    )
}
