import {
    Container,
    Grid,
    GridItem,
    Flex,
    Box,
    Text,
    Heading,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import * as getServerData from '../utils/get-server-data'
import React from "react";
import {
    ButtonGroup,
    IconButton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useColorModeValue,
    chakra,
    Link,
    Stack
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsBoxArrowUpRight, BsFillTrashFill, BsFillCloudDownloadFill } from "react-icons/bs";
function StatsTitleDescription(props) {
    return (
        <Container py={5} maxW={'container.lg'} mt="50px">
            <Grid
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(4, 1fr)',
                }}
                gap={6}>
                <GridItem w="100%" colSpan={{ base: 1, sm: 2, md: 2 }}>
                    <Heading as={'h2'}>{props.data.userData.firstName} {props.data.userData.lastName}&apos;s stats</Heading>
                </GridItem>
                <GridItem w="100%">
                    <Flex flexDirection={'column'}>
                        <Text fontSize={'4xl'} fontWeight={'bold'}>
                            {props.data.userData.points} points
                        </Text>
                    </Flex>
                </GridItem>
                <GridItem w="100%">
                    <Flex flexDirection={'column'}>
                        <Text fontSize={'4xl'} fontWeight={'bold'}>
                            {props.data.listedNotesData.length} listed notes
                        </Text>
                    </Flex>
                </GridItem>
            </Grid>
        </Container>
    );
}
function ListedNotesTable(props) {
    const header = ["name", "downloads", "points earned", "actions"];
    const data = props.data.listedNotesData;
    data.map((d) => {
        d.pointsEarned = d.downloadCount * 10
    })

    const color1 = useColorModeValue("gray.400", "gray.400");
    const color2 = useColorModeValue("gray.400", "gray.400");

    async function deleteNote(noteid) {
        if (!confirm("Are you sure you want to delete this note? This is irreversible")) return;
        let results = await fetch(`/api/manage-listing?token=${(localStorage.token || sessionStorage.token)}&action=delete&id=${noteid}`, {
            method: "POST",
        });
        results = await results.json();
        console.log(results)
        if (results.status === "ok") {
            alert("Success! Your listing has been deleted!");
            window.location.reload()
        } else {
            alert("Error! " + results.message)
        }
    }

    return (
        <Flex
            w="full"
            bg="#edf3f8"
            _dark={{ bg: "#3e3e3e" }}
            p={50}
            pt="20px"
            alignItems="center"
            justifyContent="center"
            flexDirection={"column"}
        >
            <Heading
                mb="20px"
            >Listed Notes</Heading>
            <Table
                w="full"
                bg="white"
                _dark={{ bg: "gray.800" }}
                display={{
                    base: "block",
                    md: "table",
                }}
                sx={{
                    "@media print": {
                        display: "table",
                    },
                }}
            >
                <Thead
                    display={{
                        base: "none",
                        md: "table-header-group",
                    }}
                    sx={{
                        "@media print": {
                            display: "table-header-group",
                        },
                    }}
                >
                    <Tr>
                        {header.map((x) => (
                            <Th key={x}>{x}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody
                    display={{
                        base: "block",
                        lg: "table-row-group",
                    }}
                    sx={{
                        "@media print": {
                            display: "table-row-group",
                        },
                    }}
                >
                    {data.map((token, tid) => {
                        return (
                            <Tr
                                key={tid}
                                display={{
                                    base: "grid",
                                    md: "table-row",
                                }}
                                sx={{
                                    "@media print": {
                                        display: "table-row",
                                    },
                                    gridTemplateColumns: "minmax(0px, 35%) minmax(0px, 65%)",
                                    gridGap: "10px",
                                }}
                            >
                                <React.Fragment>
                                    <Td
                                        display={{
                                            base: "table-cell",
                                            md: "none",
                                        }}
                                        sx={{
                                            "@media print": {
                                                display: "none",
                                            },
                                            textTransform: "uppercase",
                                            color: color1,
                                            fontSize: "xs",
                                            fontWeight: "bold",
                                            letterSpacing: "wider",
                                            fontFamily: "heading",
                                        }}
                                    >
                                        Name
                                    </Td>
                                    <Td
                                        color={"gray.500"}
                                        fontSize="md"
                                        fontWeight="hairline"
                                    >
                                        {token.name}
                                    </Td>
                                </React.Fragment>
                                <React.Fragment>
                                    <Td
                                        display={{
                                            base: "table-cell",
                                            md: "none",
                                        }}
                                        sx={{
                                            "@media print": {
                                                display: "none",
                                            },
                                            textTransform: "uppercase",
                                            color: color1,
                                            fontSize: "xs",
                                            fontWeight: "bold",
                                            letterSpacing: "wider",
                                            fontFamily: "heading",
                                        }}
                                    >
                                        Downloads
                                    </Td>
                                    <Td
                                        color={"gray.500"}
                                        fontSize="md"
                                        fontWeight="hairline"
                                    >
                                        {token.downloadCount}
                                    </Td>
                                </React.Fragment>
                                <React.Fragment>
                                    <Td
                                        display={{
                                            base: "table-cell",
                                            md: "none",
                                        }}
                                        sx={{
                                            "@media print": {
                                                display: "none",
                                            },
                                            textTransform: "uppercase",
                                            color: color1,
                                            fontSize: "xs",
                                            fontWeight: "bold",
                                            letterSpacing: "wider",
                                            fontFamily: "heading",
                                        }}
                                    >
                                        Points Earned
                                    </Td>
                                    <Td
                                        color={"gray.500"}
                                        fontSize="md"
                                        fontWeight="hairline"
                                    >
                                        {token.pointsEarned}
                                    </Td>
                                </React.Fragment>
                                <Td
                                    display={{
                                        base: "table-cell",
                                        md: "none",
                                    }}
                                    sx={{
                                        "@media print": {
                                            display: "none",
                                        },
                                        textTransform: "uppercase",
                                        color: color2,
                                        fontSize: "xs",
                                        fontWeight: "bold",
                                        letterSpacing: "wider",
                                        fontFamily: "heading",
                                    }}
                                >
                                    Actions
                                </Td>
                                <Td>
                                    <ButtonGroup variant="solid" size="sm" spacing={3}>
                                        <chakra.a href={"/note?id=" + token.id}>
                                            <IconButton
                                                colorScheme="blue"
                                                icon={<BsBoxArrowUpRight />}
                                                aria-label="Up"
                                            />
                                        </chakra.a>
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Flex>
    );
};
function OwnedNotesTable(props) {
    const header = ["name", "cost", "actions"];
    const data = props.data.ownedNotesData;

    const color1 = useColorModeValue("gray.400", "gray.400");
    const color2 = useColorModeValue("gray.400", "gray.400");


    return (
        <Flex
            w="full"
            bg="#edf3f8"
            _dark={{ bg: "#3e3e3e" }}
            p={50}
            pt="20px"
            alignItems="center"
            justifyContent="center"
            flexDirection={"column"}
        >
            <Heading
                mb="20px"
            >Owned Notes</Heading>
            <Table
                w="full"
                bg="white"
                _dark={{ bg: "gray.800" }}
                display={{
                    base: "block",
                    md: "table",
                }}
                sx={{
                    "@media print": {
                        display: "table",
                    },
                }}
            >
                <Thead
                    display={{
                        base: "none",
                        md: "table-header-group",
                    }}
                    sx={{
                        "@media print": {
                            display: "table-header-group",
                        },
                    }}
                >
                    <Tr>
                        {header.map((x) => (
                            <Th key={x}>{x}</Th>
                        ))}
                    </Tr>
                </Thead>
                <Tbody
                    display={{
                        base: "block",
                        lg: "table-row-group",
                    }}
                    sx={{
                        "@media print": {
                            display: "table-row-group",
                        },
                    }}
                >
                    {data.map((token, tid) => {
                        return (
                            <Tr
                                key={tid}
                                display={{
                                    base: "grid",
                                    md: "table-row",
                                }}
                                sx={{
                                    "@media print": {
                                        display: "table-row",
                                    },
                                    gridTemplateColumns: "minmax(0px, 35%) minmax(0px, 65%)",
                                    gridGap: "10px",
                                }}
                            >
                                <React.Fragment>
                                    <Td
                                        display={{
                                            base: "table-cell",
                                            md: "none",
                                        }}
                                        sx={{
                                            "@media print": {
                                                display: "none",
                                            },
                                            textTransform: "uppercase",
                                            color: color1,
                                            fontSize: "xs",
                                            fontWeight: "bold",
                                            letterSpacing: "wider",
                                            fontFamily: "heading",
                                        }}
                                    >
                                        Name
                                    </Td>
                                    <Td
                                        color={"gray.500"}
                                        fontSize="md"
                                        fontWeight="hairline"
                                    >
                                        {token.name}
                                    </Td>
                                </React.Fragment>
                                <React.Fragment>
                                    <Td
                                        display={{
                                            base: "table-cell",
                                            md: "none",
                                        }}
                                        sx={{
                                            "@media print": {
                                                display: "none",
                                            },
                                            textTransform: "uppercase",
                                            color: color1,
                                            fontSize: "xs",
                                            fontWeight: "bold",
                                            letterSpacing: "wider",
                                            fontFamily: "heading",
                                        }}
                                    >
                                        Price
                                    </Td>
                                    <Td
                                        color={"gray.500"}
                                        fontSize="md"
                                        fontWeight="hairline"
                                    >
                                        8 Points
                                    </Td>
                                </React.Fragment>
                                <Td
                                    display={{
                                        base: "table-cell",
                                        md: "none",
                                    }}
                                    sx={{
                                        "@media print": {
                                            display: "none",
                                        },
                                        textTransform: "uppercase",
                                        color: color2,
                                        fontSize: "xs",
                                        fontWeight: "bold",
                                        letterSpacing: "wider",
                                        fontFamily: "heading",
                                    }}
                                >
                                    Actions
                                </Td>
                                <Td>
                                    <ButtonGroup variant="solid" size="sm" spacing={3}>
                                        <chakra.a href={"/note?id=" + token.id}>
                                            <IconButton
                                                colorScheme="blue"
                                                icon={<BsBoxArrowUpRight />}
                                                aria-label="Up"
                                            />
                                        </chakra.a>
                                    </ButtonGroup>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Flex>
    );
};

export default function Dashboard() {
    const [data, setData] = useState({
        loading: true,
        userData: {},
        listedNotesData: [],
        ownedNotesData: []
    });
    useEffect(() => {
        async function getData() {
            if (data.loading === true) {
                var userData = await getServerData.userhash(window.location.search.slice(4))
                setData({
                    userData: userData,
                    listedNotesData: await getServerData.listedNotes(userData),
                    ownedNotesData: await getServerData.ownedNotes(userData),
                    loading: false
                })
            }
        }
        getData()
    }, [data])
    return (
        <div>
            <StatsTitleDescription data={data} />
            <ListedNotesTable data={data} />
            <OwnedNotesTable data={data} />
        </div>
    )
}
