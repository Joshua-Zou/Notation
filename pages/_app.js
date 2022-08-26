import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from "./components/navbar.js"
import 'semantic-ui-css/semantic.min.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Navbar/>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp