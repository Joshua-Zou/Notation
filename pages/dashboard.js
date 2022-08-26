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
                    <Heading as={'h2'}>Your Stats</Heading>
                    <Text fontSize="xl">{props.data.userData.firstName} {props.data.userData.lastName}</Text>
                </GridItem>
                <GridItem w="100%">
                    <Flex flexDirection={'column'}>
                        <Text fontSize={'4xl'} fontWeight={'bold'}>
                            {props.data.userData.points} points
                        </Text>
                        <Box fontSize={'sm'}>
                            Use these points to purchase notes! Earn points by listing your own notes!
                        </Box>
                    </Flex>
                </GridItem>
                <GridItem w="100%">
                    <Flex flexDirection={'column'}>
                        <Text fontSize={'4xl'} fontWeight={'bold'}>
                            {props.data.listedNotesData.length} listed notes
                        </Text>
                        <Box fontSize={'sm'}>
                            The number of notes you have listed (uploaded to the marketplace)
                        </Box>
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
                                        <chakra.a href={"/edit?id=" + token.id}>
                                            <IconButton
                                                colorScheme="green"
                                                icon={<AiFillEdit />}
                                                aria-label="Edit"
                                            />
                                        </chakra.a>
                                        <IconButton
                                            colorScheme="red"
                                            variant="outline"
                                            icon={<BsFillTrashFill />}
                                            aria-label="Delete"
                                            onClick={() => deleteNote(token.id)}
                                        />
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
                                        10 Points
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
                                        <chakra.a href={token.downloadLink}>
                                            <IconButton
                                                colorScheme="green"
                                                icon={<BsFillCloudDownloadFill />}
                                                aria-label="Download"
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
function CreateNewBtn() {
    return (
        <Flex
        bg="#edf3f8"
        _dark={{
            bg: "#3e3e3e",
        }}
        p={50}
        w="full"
        alignItems="center"
        justifyContent="center"
    >
        <Box
            bg="gray.50"
            _dark={{
                bg: "gray.800",
            }}
        >
            <Box
                maxW="7xl"
                w={{
                    md: "3xl",
                    lg: "4xl",
                }}
                mx="auto"
                py={{
                    base: 12,
                    lg: 16,
                }}
                px={{
                    base: 4,
                    lg: 8,
                }}
                display={{
                    lg: "flex",
                }}
                alignItems={{
                    lg: "center",
                }}
                justifyContent={{
                    lg: "space-between",
                }}
            >
                <chakra.h2
                    fontSize={{
                        base: "3xl",
                        sm: "4xl",
                    }}
                    fontWeight="extrabold"
                    letterSpacing="tight"
                    lineHeight="shorter"
                    color="gray.900"
                    _dark={{
                        color: "gray.100",
                    }}
                >
                    <chakra.span display="block">Create your first listing</chakra.span>
                    <chakra.span
                        display="block"
                        color="teal.600"
                        _dark={{
                            color: "gray.500",
                        }}
                    >
                        Start learning better
                    </chakra.span>
                </chakra.h2>
                <Stack
                    direction={{
                        base: "column",
                        sm: "row",
                    }}
                    mt={{
                        base: 8,
                        lg: 0,
                    }}
                    flexShrink={{
                        lg: 0,
                    }}
                >
                    <Link
                        w={["full", , "auto"]}
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        px={5}
                        py={3}
                        border="solid transparent"
                        fontWeight="bold"
                        rounded="md"
                        shadow="md"
                        _light={{
                            color: "white",
                        }}
                        bg="teal.600"
                        _dark={{
                            bg: "teal.500",
                        }}
                        _hover={{
                            bg: "teal.700",
                            _dark: {
                                bg: "teal.600",
                            },
                        }}
                        href="/new"
                    >
                        Upload My Notes
                    </Link>
                    <Link
                        w={["full", , "auto"]}
                        display="inline-flex"
                        alignItems="center"
                        justifyContent="center"
                        px={5}
                        py={3}
                        border="solid transparent"
                        fontWeight="bold"
                        rounded="md"
                        shadow="md"
                        color="teal.600"
                        bg="white"
                        _hover={{
                            bg: "teal.50",
                        }}
                        href="/marketplace"
                    >
                        Explore Other Notes
                    </Link>
                </Stack>
            </Box>
        </Box>
    </Flex>
    )
}


export default function Dashboard() {
    const [data, setData] = useState({
        loading: true,
        userData: {},
        listedNotesData: [],
        ownedNotesData: []
    });
    console.log(data)
    useEffect(() => {
        async function getData() {
            if (data.loading === true) {
                var userData = await getServerData.user()
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
            <CreateNewBtn/>
            <ListedNotesTable data={data} />
            <OwnedNotesTable data={data} />
        </div>
    )
}
