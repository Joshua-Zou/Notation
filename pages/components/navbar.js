import React, { useEffect } from "react";
import Head from "next/head"

import {
    chakra,
    Box,
    Flex,
    useColorModeValue,
    VisuallyHidden,
    HStack,
    Button,
    useDisclosure,
    VStack,
    IconButton,
    CloseButton,
    Image,
    Avatar
} from "@chakra-ui/react";
import { AiOutlineMenu } from "react-icons/ai";
import { Logo } from "../../public/logo-text.png";

const Navbar = () => {
    const bg = useColorModeValue("teal.50", "gray.800");
    const mobileNav = useDisclosure();

    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setIsLoggedIn(localStorage.token || sessionStorage.token)
    }, [typeof window])


    return (
        <React.Fragment>
            <Head>
                <title>Notation</title>
                <link rel="icon" href="/favicon.png"></link>
            </Head>
            <chakra.header
                bg={bg}
                w="full"
                px={{ base: 2, sm: 4 }}
                py={4}
                shadow="md"
            >
                <Flex alignItems="center" justifyContent="space-between" mx="auto">
                    <Flex>
                        <chakra.a
                            href="/"
                            title="Home Page"
                            display="flex"
                            alignItems="center"
                        >
                            <Image w="200px" src="/logo-text.png" alt="Logo" />
                        </chakra.a>
                    </Flex>
                    <HStack display="flex" alignItems="center" spacing={1}>
                        <HStack
                            spacing={1}
                            mr={1}
                            color="teal.500"
                            display={{ base: "none", md: "inline-flex" }}
                        >
                            <chakra.a href="/dashboard"><Button variant="ghost" _hover={{ bg: "teal.100" }}>Dashboard</Button></chakra.a>
                            <chakra.a href="/marketplace"><Button variant="ghost" _hover={{ bg: "teal.100" }}>Marketplace</Button></chakra.a>
                            {
                                !isLoggedIn && (
                                    <chakra.a href="/signin"><Button variant="ghost" _hover={{ bg: "teal.100" }}>Sign in</Button></chakra.a>
                                )
                            }
                        </HStack>
                        {
                            !isLoggedIn && (
                                <chakra.a href="/signup">
                                    <Button colorScheme="teal" size="sm">
                                        Get Started
                                    </Button>
                                </chakra.a>
                            )
                        }
                        {
                            isLoggedIn && (
                               <Avatar name="profile picture" src={"/api/pfp?token="+isLoggedIn}/>
                            )
                        }

                        {/* Mobile stuff */}
                        <Box display={{ base: "inline-flex", md: "none" }}>
                            <IconButton
                                display={{ base: "flex", md: "none" }}
                                aria-label="Open menu"
                                fontSize="20px"
                                color="gray.800"
                                _dark={{ color: "inherit" }}
                                variant="ghost"
                                icon={<AiOutlineMenu />}
                                onClick={mobileNav.onOpen}
                            />

                            <VStack
                                pos="absolute"
                                top={0}
                                left={0}
                                right={0}
                                display={mobileNav.isOpen ? "flex" : "none"}
                                flexDirection="column"
                                p={2}
                                pb={4}
                                m={2}
                                bg={bg}
                                spacing={3}
                                rounded="sm"
                                shadow="sm"
                            >
                                <CloseButton
                                    aria-label="Close menu"
                                    onClick={mobileNav.onClose}
                                />
                                <chakra.a href="/dashboard">
                                    <Button w="full" variant="ghost">
                                        Dashboard
                                    </Button>
                                </chakra.a>
                                <chakra.a href="/marketplace">
                                    <Button w="full" variant="ghost">
                                        Marketplace
                                    </Button>
                                </chakra.a>
                                <chakra.a href="/signin">
                                    <Button w="full" variant="ghost">
                                        Sign in
                                    </Button>
                                </chakra.a>
                            </VStack>
                        </Box>
                    </HStack>
                </Flex>
            </chakra.header>
        </React.Fragment>
    );
};
export default Navbar;