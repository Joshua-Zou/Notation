import Image from "next/image";
import gif from "../../public/loading.gif"
import {Flex} from "@chakra-ui/react"

export default function Loader(props) {
    return (
        <Flex {...props}>
            <Image src={gif} height={100} width={100} alt="Loading..."/>
        </Flex>
    )
}