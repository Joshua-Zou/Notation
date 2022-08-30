import React from "react";
import { Box, Flex, Image, Link, chakra, Text, useDisclosure, Drawer, DrawerOverlay, DrawerContent, IconButton, InputGroup, InputLeftElement, Input, Icon, Collapse, useColorModeValue, Button } from "@chakra-ui/react";
import { FiMenu, FiSearch } from "react-icons/fi"
import { MdHome, MdKeyboardArrowRight } from "react-icons/md"
import { AiFillTags } from "react-icons/ai"
import { Dropdown } from 'semantic-ui-react'
import Avatar from "boring-avatars"


const Card = (props) => {
    var usedTags = props.allTags.filter(t => {
        return props.noteTags.includes(Object.keys(t)[0])
    })
    return (
        <Flex
            bg="#edf3f8"
            _dark={{ bg: "#3e3e3e" }}
            p={50}
            w="full"
            alignItems="center"
            justifyContent="center"
        >
            <Box
                mx="auto"
                px={8}
                py={4}
                rounded="lg"
                shadow="lg"
                bg="white"
                _dark={{ bg: "gray.800" }}
                w="2xl"
            >
                <Flex justifyContent="space-between" alignItems="center">
                    <chakra.span
                        fontSize="sm"
                        color="gray.600"
                        _dark={{ color: "gray.400" }}
                    >
                    </chakra.span>
                    <div>
                        <Tags tags={usedTags} />
                    </div>
                </Flex>

                <Box mt={2}>
                    <Link
                        fontSize="2xl"
                        color="gray.700"
                        _dark={{ color: "white" }}
                        fontWeight="700"
                        _hover={{
                            color: "gray.600",
                            _dark: {
                                color: "gray.200",
                            },
                            textDecor: "underline",
                        }}
                        href={"/note?id=" + props.id}
                    >
                        {props.name}
                    </Link>
                    <chakra.p mt={2} color="gray.600" _dark={{ color: "gray.300" }}>
                        {props.tagline}
                    </chakra.p>
                </Box>

                <Flex justifyContent="space-between" alignItems="center" mt={4}>
                    <Link
                        color="brand.600"
                        _dark={{ color: "brand.400" }}
                        _hover={{ textDecor: "underline" }}
                        href={"/note?id=" + props.id}
                    >
                        Purchase or Download
                    </Link>

                    <Flex alignItems="center">
                        <Link
                            color="brand.600"
                            _dark={{ color: "brand.400" }}
                            _hover={{ textDecor: "underline" }}
                            href={"/user?id=" + props.userhash}
                        >
                                                    <Avatar
                        size={42}
                        name={props.userhash}
                        variant={"beam"}
                        colors={['#C1DDC7', '#F5E8C6', '#BBCD77', '#DC8051', '#F4D279']}
                        square={false}
                        />
                        </Link>
                    </Flex>
                </Flex>
            </Box>
        </Flex>
    );
};

function Tags(props) {
    return (
        <div>
            {
                props.tags.map(t => {
                    return (
                        <Text rounded="full" py={2} px={4} mx={1} display="inline-block" key={Object.keys(t)[0]} backgroundColor={Object.values(t)[0]}>{Object.keys(t)[0]}</Text>
                    )
                })
            }
        </div>
    )
}

function SearchOptions(props) {

    const sidebar = useDisclosure();
    const integrations = useDisclosure();
    const color = useColorModeValue("gray.600", "gray.300");

    const [selectedTags, setSelectedTags] = React.useState([])
    const [searchResults, setSearchResults] = React.useState([])
    const queryRef = React.useRef()
    var queryCursor = React.useRef(0)


    const NavItem = (props) => {
        const { icon, children, ...rest } = props;
        return (
            <Flex
                align="center"
                px="4"
                pl="4"
                py="3"
                cursor="pointer"
                color="inherit"
                _dark={{
                    color: "gray.400",
                }}
                _hover={{
                    bg: "gray.100",
                    _dark: {
                        bg: "gray.900",
                    },
                    color: "gray.900",
                }}
                role="group"
                fontWeight="semibold"
                transition=".15s ease"
                {...rest}
            >
                {icon && (
                    <Icon
                        mx="2"
                        boxSize="4"
                        _groupHover={{
                            color: color,
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        );
    };
    var dropdownTags = props.allTags.map(tag => {
        var x = {
            key: Object.keys(tag)[0],
            value: Object.keys(tag)[0],
            text: Object.keys(tag)[0]
        }
        return x
    })


    async function updateSearch(resetCursor = true) {
        if (resetCursor) queryCursor.current = 0
        else queryCursor.current = queryCursor.current + 1;
        var query = queryRef.current.value;
        var tags = selectedTags;
        console.log(`/api/search?query=${query}&tags=${JSON.stringify(tags)}&cursor=${queryCursor.current}`)
        let results = await fetch(`/api/search?query=${query}&tags=${JSON.stringify(tags)}&cursor=${queryCursor.current}`);
        results = await results.json();
        setSearchResults(results.data)
    }

    function changeTags(e, d) {
        setSelectedTags(d.value)
        updateSearch();
    }

    const SidebarContent = () => (
        <Box
            as="nav"
            pos="absolute"
            top="82px"
            left="0"
            zIndex="sticky"
            h="full"
            pb="10"
            overflowX="hidden"
            overflowY="auto"
            bg="white"
            _dark={{
                bg: "gray.800",
            }}
            border
            color="inherit"
            borderRightWidth="1px"
            w="60"
        >
            <Flex px="4" py="5" align="center">
                <Text
                    fontSize="2xl"
                    ml="2"
                    color="brand.500"
                    _dark={{
                        color: "white",
                    }}
                    fontWeight="semibold"
                >
                    Search Filters
                </Text>
            </Flex>
            <Flex
                direction="column"
                as="nav"
                fontSize="sm"
                color="gray.600"
                aria-label="Main Navigation"
            >
                <NavItem icon={AiFillTags} onClick={integrations.onToggle}>
                    Includes Tag
                    <Icon
                        as={MdKeyboardArrowRight}
                        ml="auto"
                        transform={integrations.isOpen && "rotate(90deg)"}
                    />
                </NavItem>
                <Collapse in={integrations.isOpen} style={{ overflow: "visible" }}>
                    <Dropdown
                        placeholder='Tags'
                        fluid
                        multiple
                        search
                        selection
                        options={dropdownTags}
                        onChange={changeTags}
                        value={selectedTags}
                    />
                </Collapse>
            </Flex>
        </Box>
    );

    return (
        <Box
            as="section"
            bg="gray.50"
            _dark={{
                bg: "gray.700",
            }}
            minH="100vh"
        >
            <SidebarContent
                display={{
                    base: "none",
                    md: "unset",
                }}
            />
            <Drawer
                isOpen={sidebar.isOpen}
                onClose={sidebar.onClose}
                placement="left"
            >
                <DrawerOverlay />
                <DrawerContent>
                    <SidebarContent w="full" borderRight="none" />
                </DrawerContent>
            </Drawer>
            <Box
                ml={{
                    base: 0,
                    md: 60,
                }}
                transition=".3s ease"
            >
                <Flex
                    as="header"
                    align="center"
                    justify="space-between"
                    w="full"
                    px="4"
                    bg="white"
                    _dark={{
                        bg: "gray.800",
                    }}
                    borderBottomWidth="1px"
                    color="inherit"
                    h="14"
                >
                    <IconButton
                        aria-label="Menu"
                        display={{
                            base: "inline-flex",
                            md: "none",
                        }}
                        onClick={sidebar.onOpen}
                        icon={<FiMenu />}
                        size="sm"
                    />
                    <InputGroup
                        w="96"
                        display={{
                            base: "none",
                            md: "flex",
                        }}
                    >
                        <InputLeftElement color="gray.500">
                            <FiSearch />
                        </InputLeftElement>
                        <Input placeholder="Search for notes..." ref={queryRef} onKeyUp={(e) => {
                            if (e.key === "Enter") updateSearch()
                        }} />
                    </InputGroup>

                    <Flex align="center">

                    </Flex>
                </Flex>

                <Box as="main" p="4">
                    {/* Add content here, remove div below  */}
                    {/* <Box borderWidth="4px" borderStyle="dashed" rounded="md" h="96" /> */}
                    <CardWrapper allTags={props.allTags} searchResults={searchResults} />
                    <Link
                        color="brand.600"
                        _dark={{ color: "brand.400" }}
                        _hover={{ textDecor: "underline" }}
                        onClick={() => updateSearch(false)}
                    >
                        Try Loading More
                    </Link>
                </Box>
            </Box>
        </Box>
    );


}

function CardWrapper(props) {
    return (
        <div>
            {props.searchResults.map(note => {
                return (
                    <Card allTags={props.allTags}
                        key={note.id}
                        name={note.name}
                        noteTags={note.tags}
                        id={note.id}
                        tagline={note.tagline}
                        userhash={note.userhash}
                    />
                )
            })}
        </div>
    )
}

export default function Marketplace() {

    const [preRenderData, setPreRenderData] = React.useState({ loading: true })


    if (preRenderData.loading) {
        loadData()
        async function loadData() {
            if (typeof window === "undefined") return
            let results = await fetch(process.env.NEXT_PUBLIC_DOMAIN + "/api/tags");
            results = await results.json();
            setPreRenderData({
                tags: results
            })
        }
    }

    if (preRenderData.loading) return <div></div>
    else return (
        <SearchOptions allTags={preRenderData.tags} />
    )
};