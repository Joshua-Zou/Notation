import { Container } from '@chakra-ui/react';
import { DiscussionEmbed } from 'disqus-react';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

import * as getServerData from '../utils/get-server-data'

import ReactMarkdown from 'react-markdown'




import {
    Grid,
    GridItem,
    Flex,
    Box,
    Text,
    Heading,
} from '@chakra-ui/react';
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
    Stack,
    Button,
    Textarea
} from "@chakra-ui/react";
import {
    SimpleGrid,
    Image,
    StackDivider,
    Icon,
    Input,
} from '@chakra-ui/react';
import { Dropdown } from 'semantic-ui-react'

import { ReactElement } from 'react';
import Avatar from "boring-avatars"
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./components/pdf-viewer"), {
    ssr: false
});


function PdfViewUpload(props) {
    if (props.pdfurl) {
        return (
            <Container
                padding="0px"
                borderRadius={"10px"}
                backgroundColor="rgba(0,0,0,0.1)"
            >
                <PDFViewer file={props.pdfurl} />
            </Container>
        )
    }

}

function TagSelector(props) {
    var [tags, setTags] = useState([{
        loading: true
    }]);
    fetchTags()
    async function fetchTags(force) {
        if (tags[0].loading === true || force === true) {
            let results = await fetch(process.env.NEXT_PUBLIC_DOMAIN + "/api/tags");
            results = await results.json();
            setTags(results)
        }
    }
    props.defaultValue
    var usedTags = tags.filter(t => {
        return props.defaultValue.includes(Object.keys(t)[0])
    })
    return (
        <div>
            {
                usedTags.map(t => {
                    return (
                        <Text rounded="full" py={2} px={4} mx={1} display="inline-block" key={Object.keys(t)[0]} backgroundColor={Object.values(t)[0]}>{Object.keys(t)[0]}</Text>
                    )
                })
            }
        </div>
    )
}


function SplitWithImage(props) {

    console.log(props.ownerData)

    async function purchase() {
        if (!confirm("Are you sure you want to purchase this note for 8 points?")) return;
        let results = await fetch(`/api/purchase?token=${localStorage.token || sessionStorage.token}&noteid=${props.initial.id}`);
        results = await results.json();
        if (results.status === "ok") {
            alert("Purchased successfully!");
            window.location.reload();
        } else {
            alert("Error: " + results.message);
        }
    }

    function Actions() {
        if (props.initial.downloadLink) {
            return (
                <Container
                    position="relative"
                    left="50px"
                    top="-20px"
                    margin="0"
                    maxWidth="calc(100vw - 80px)"
                >
                    <Text
                        textTransform={'uppercase'}
                        color={'blue.400'}
                        fontWeight={600}
                        fontSize={'md'}
                        bg={'blue.50'}
                        p={2}
                        alignSelf={'flex-start'}
                        display="inline-block"
                        rounded={'md'}
                    >
                        Owned
                    </Text>
                    <Text
                        onClick={() => window.open(`/api/download?noteid=${props.initial.id}&token=${localStorage.token || sessionStorage.token}`)}
                        cursor="pointer"
                        textTransform={'uppercase'}
                        color={'teal.400'}
                        fontWeight={600}
                        fontSize={'md'}
                        bg={'teal.50'}
                        p={2}
                        alignSelf={'flex-start'}
                        display="inline-block"
                        ml="20px"
                        transition="all 0.2s"
                        _hover={{
                            bg: "teal.100"
                        }}
                        rounded={'md'}>
                        Download
                    </Text>
                </Container>
            )
        } else {
            return (
                <Container
                    position="relative"
                    left="50px"
                    top="-20px"
                    margin="0"
                >
                    <Text
                        textTransform={'uppercase'}
                        color={'blue.400'}
                        fontWeight={600}
                        fontSize={'md'}
                        bg={'blue.50'}
                        p={2}
                        alignSelf={'flex-start'}
                        display="inline-block"
                        rounded={'md'}>
                        Not Owned
                    </Text>
                    <Text
                        onClick={purchase}
                        cursor="pointer"
                        textTransform={'uppercase'}
                        color={'teal.400'}
                        fontWeight={600}
                        fontSize={'md'}
                        bg={'teal.50'}
                        p={2}
                        alignSelf={'flex-start'}
                        display="inline-block"
                        ml="20px"
                        transition="all 0.2s"
                        _hover={{
                            bg: "teal.100"
                        }}
                        rounded={'md'}>
                        Purchase
                    </Text>
                </Container>
            )
        }
    }

    return (
        <Container maxW={'100rem'} py={12} mt="40px">
            <Actions />
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20}>
                <Flex>
                    <PdfViewUpload pdfurl={props.initial.downloadLink} />
                </Flex>
                <Stack spacing={4} zIndex={1}>
                    <Flex alignItems="center">
                        <Avatar
                            size={30}
                            name={props.initial.userhash}
                            variant={"beam"}
                            colors={['#C1DDC7', '#F5E8C6', '#BBCD77', '#DC8051', '#F4D279']}
                            square={false}
                        />
                        <Link display="inline-block"
                            verticalAlign="middle"
                            mx={2}
                            fontWeight="medium"
                            color="gray.700"
                            href={"/user?id=" + props.initial.userhash}
                        >{props.ownerData.firstName} {props.ownerData.lastName}</Link>
                    </Flex>
                    <Text
                        fontWeight="bold"
                        fontSize="36px"
                        paddingLeft="0"
                        border="none"
                        placeholder="Note Name"
                    >
                        {props.initial.name}
                    </Text>
                    <Text
                        fontSize="18px"
                        paddingLeft="0"
                        border="none"
                        placeholder="Tag Line"
                    >
                        {props.initial.tagline}
                    </Text>
                    <TagSelector defaultValue={props.initial.tags} />
                    <ReactMarkdown className="markdown-viewer">{props.initial.description}</ReactMarkdown>
                </Stack>
            </SimpleGrid>
        </Container>
    );
}

export async function getServerSideProps({ req }) {
    let results = await getServerData.note(req.url.slice("/note?id=".length), true)
    return {
        props: {
            initialConfig: {
                tags: results.tags,
                tagline: results.tagline,
                markdownDescription: results.description,
                name: results.name,
                loading: false
            }
        }
    }
}

function Comments(props) {
    const router = useRouter();
    const [disqusConfig, setDisqusConfig] = useState({});

    useEffect(() => {
        if (disqusConfig.title && disqusConfig.identifier) return
        setDisqusConfig({ url: "https://www.notation.tk/" + router.query.id, identifier: router.query.id, title: "Note Comments", language: "en" });
    }, [router.query.id])



    if (router.query.id && props.show) {
        return (
            <Container py={5} maxW={'container.lg'} mt="50px" >
                <DiscussionEmbed shortname="my-web-site" config={disqusConfig} />
            </Container>
        )
    } else {
        return (
            <div>
                Loading...
            </div>
        )
    }
}

export default function Note(props) {
    const router = useRouter();

    const [data, setData] = useState({
        loading: true,
        noteData: {
            tags: []
        },
        ownerData: {}
    });
    useEffect(() => {
        async function getData() {
            if (data.loading === true) {
                if (!router.query.id) return;
                let noteData = await getServerData.note(router.query.id)
                let ownerData = await getServerData.userhash(noteData.userhash)
                console.log(ownerData)
                if (!noteData) return window.location.href = "/404"
                setData({
                    noteData: noteData,
                    ownerData: ownerData,
                    loading: false
                })
            }
        }
        getData()
    })
    return (
        <div>
            <SplitWithImage initial={data.noteData} ownerData={data.ownerData}/>
            <Comments show={!data.loading} />
        </div>
    )
}

