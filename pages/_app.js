import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Navbar from "./components/navbar.js"
import Footer from "./components/footer.js"
import 'semantic-ui-css/semantic.min.css'

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Navbar/>
      <Component {...pageProps} />
      <Footer/>
    </ChakraProvider>
  )
}

export default MyApp