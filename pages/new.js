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
    Stack,
    Button,
    Textarea
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsBoxArrowUpRight, BsFillTrashFill, BsFillCloudDownloadFill } from "react-icons/bs";
import {
    SimpleGrid,
    Image,
    StackDivider,
    Icon,
    Input
} from '@chakra-ui/react';
import { Dropdown } from 'semantic-ui-react'

import { ReactElement } from 'react';

import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("./components/pdf-viewer"), {
    ssr: false
});


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
            <SplitWithImage data={data} />
        </div>
    )
}


function PdfViewUpload(props) {
    const [selectedFile, setSelectedFile] = useState();
    const uploadFileRef = useRef()
    const changeHandler = (event) => {
        var file = event.target.files[0]
        setSelectedFile(file)
        props.onFileChange(file)
    };
    function uploadFile() {
        uploadFileRef.current.click()
    }
    return (
        <Container
            padding="0px"
            borderRadius={"10px"}
            _hover={{
                opacity: "80%",
                position: "relative",
                _after: {
                    content: "'Click to Upload File'",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }
            }}
            backgroundColor="rgba(0,0,0,0.1)"
        >
            <input style={{ display: "none" }} ref={uploadFileRef} type="file" name="file" onChange={changeHandler} accept=".pdf" />
            <PDFViewer file={selectedFile} onClick={uploadFile} />
        </Container>
    )
}

function TagSelector(props) {
    var [tags, setTags] = useState([{
        loading: true
    }]);
    fetchTags()
    async function fetchTags(force) {
        if (tags[0].loading === true || force === true) {
            if (typeof window === "undefined") return;
            let results = await fetch(process.env.NEXT_PUBLIC_DOMAIN+"/api/notes?action=list-tags");
            results = await results.json();
            results = results.map(tag => {
                var x = {
                    key: Object.keys(tag)[0],
                    value: Object.keys(tag)[0],
                    text: Object.keys(tag)[0]
                }
                return x
            })
            setTags(results)
        }
    }
    async function addTag() {
        let tagName = prompt("Enter the custom tag name you want!").toString()
        let results = await fetch(process.env.NEXT_PUBLIC_DOMAIN+"/api/notes?action=add-tag", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tagName: tagName
            })
        });
        results = await results.json();
        if (results.status === "ok") {
            alert("Added tag!");
            fetchTags(true)
        } else {
            alert(results.message)
        }
    }
    return (
        <div>
            <Dropdown
                placeholder='Tags'
                fluid
                multiple
                search
                selection
                options={tags}
                onChange={props.onChange}
            />
            <Button onClick={addTag}>New Custom Tag</Button>
        </div>
    )
}


function SplitWithImage() {
    const userInputedData = useRef({
        pdf: "",
        tags: [],
        tagline: "",
        markdownDescription: "",
        name: ""
    })
    function onFileChange(newFile) {
        let newData = {
            ...userInputedData.current
        }
        newData.pdf = newFile;
        userInputedData.current = newData
    }

    async function createNote() {
        let formData = new FormData();




        formData.append("pdf", userInputedData.current.pdf);
        formData.append("name", userInputedData.current.name);
        formData.append("tags", JSON.stringify(userInputedData.current.tags))
        formData.append("tagline", userInputedData.current.tagline)
        formData.append("description", userInputedData.current.markdownDescription)
        
        console.log(formData)
        let results = await fetch(`/api/manage-listing?token=${(localStorage.token || sessionStorage.token)}&action=create`, {
            method: "POST",
            body: formData
        });
        results = await results.json();
        console.log(results)
        if (results.status === "ok") {
            alert("Success! Your note is now on the marketplace!");
            window.location.href = "/dashboard"
        } else {
            alert("Error! "+results.message)
        }
    }

    function changeMdDesc(e) {
        let newData = {
            ...userInputedData.current
        }
        newData.markdownDescription = e.target.value;
        userInputedData.current = newData
    }
    function changeTitle(e) {
        let newData = {
            ...userInputedData.current
        }
        newData.name = e.target.value;
        userInputedData.current = newData
    }
    function changeTagline(e) {
        let newData = {
            ...userInputedData.current
        }
        newData.tagline = e.target.value;
        userInputedData.current = newData
    }
    function changeTags(list) {
        let newData = {
            ...userInputedData.current
        }
        newData.tags = list
        userInputedData.current = newData
    }
    return (
        <Container maxW={'100rem'} py={12} mt="40px">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20}>
                <Flex>
                    <PdfViewUpload onFileChange={onFileChange} />
                </Flex>
                <Stack spacing={4}>
                    <Input
                        fontWeight="bold"
                        fontSize="36px"
                        paddingLeft="0"
                        border="none"
                        placeholder="Note Name"
                        onChange={(e) => { changeTitle(e) }}
                    />
                    <Input
                        fontSize="18px"
                        paddingLeft="0"
                        border="none"
                        placeholder="Tag Line"
                        onChange={(e) => { changeTagline(e) }}
                    />
                    <TagSelector onChange={(e, d) => { changeTags(d.value) }} />
                    <Textarea onChange={(e) => { changeMdDesc(e) }} placeholder='In depth description and maybe some samples of your note! We support markdown formatting' height="300px" />
                    <Button backgroundColor="teal.200" onClick={createNote}>Create</Button>

                </Stack>
            </SimpleGrid>
        </Container>
    );
}