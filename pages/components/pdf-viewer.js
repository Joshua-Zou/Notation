import { useState } from "react";
// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf";
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../../utils/pdf-worker.js";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
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
    Container,
    Text,
    Box
} from "@chakra-ui/react";

import { BiChevronRight, BiChevronLeft } from "react-icons/bi"

export default function PDFViewer(props) {
    const [numPages, setNumPages] = useState(null);
    const [currentPage, setCurrentPage] = useState(0)

    function onDocumentLoadSuccess({ numPages: nextNumPages }) {
        setNumPages(nextNumPages);
    }

    function changePageTo(pageNum) {
        if (pageNum < 0 || pageNum > numPages - 1) return;
        setCurrentPage(pageNum)
    }

    return (
        <Container
            position="relative"
            height="100%"
            padding={"0px"}
        >
            <Box height="100%" width="100%" onClick={props.onClick || function () { }}>
                <Document file={props.file} onLoadSuccess={onDocumentLoadSuccess}>
                    {Array.from({ length: numPages }, (_, index) => {
                        if (index !== currentPage) return (<div key={`page_${index + 1}`}></div>)
                        return (
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                            />
                        )
                    })}
                </Document>
            </Box>
            <Container
                height="45px"
                width="fit-content"
                backgroundColor="white"
                position="absolute"
                left="50%"
                transform="translateX(-50%)"
                bottom="40px"
                borderRadius="4px"
                overflow="hidden"
                padding="0"
                boxShadow="xl"
            >
                <IconButton height="100%" width="45px" borderRadius="0px" icon={<BiChevronLeft />} bg="transparent" onClick={() => { changePageTo(currentPage - 1) }} />
                <Text display="inline-block" paddingLeft="8px" paddingRight="8px" verticalAlign="middle">
                    {currentPage + 1} of {numPages}
                </Text>
                <IconButton height="100%" width="45px" borderRadius="0px" icon={<BiChevronRight />} bg="transparent" onClick={() => { changePageTo(currentPage + 1) }} />
            </Container>
        </Container>
    );
}
