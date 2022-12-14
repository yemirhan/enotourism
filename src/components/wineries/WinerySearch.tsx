import { TourTypes } from '@/pages/dashboard/create_tour'
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


export const WinerySearch = ({
    search,
    setSearch,
    setCountryId,
    setTypeOfWine,
    setActivities
}: {
    search: string
    setSearch: (search: string) => void
    setCountryId: (countryId: string) => void,
    setTypeOfWine: (typeOfWine: WineTypes) => void
    setActivities: (activities: OfferTypeEnum[]) => void
}) => {
    const { data: countries } = trpc.countries.getCountries.useQuery()
    return (
        <Paper withBorder p={"md"} >
            <Group grow spacing={"lg"}>
                <TextInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Where do you want to go?' icon={<IconSearch size={18} />} />
                <Select
                    data={(countries || []).map(country => ({ value: country.id, label: country.name }))}
                    searchable
                    icon={<IconMapPin size={18} />}
                    placeholder="Location"
                    onChange={(e) => setCountryId(e || "")}
                />
                <Select
                    data={Object.values(WineTypes).map(type => ({ value: type, label: type }))}
                    searchable
                    icon={<IconActivity size={18} />}
                    placeholder="Type of wine"
                    onChange={(e: WineTypes) => setTypeOfWine(e)}
                />
                <MultiSelect
                    icon={<IconActivity size={18} />}
                    placeholder="Activities"
                    required
                    data={
                        (Object.entries(OfferTypeEnum)).map((tourType, k) => {
                            return {
                                label: TourTypes[tourType[1]],
                                value: tourType[1],
                            }
                        })
                    }
                    searchable

                    onChange={(e: OfferTypeEnum[]) => setActivities(e)}
                />

                <Button leftIcon={<IconSearch size={18} />}>
                    Search
                </Button>
            </Group>
        </Paper>
    )
}
