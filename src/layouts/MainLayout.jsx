import { Box } from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
    return (
        <Box h="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box as="main" flex="1">
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default MainLayout;