import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box bg="gray.800" color="white" py={3} textAlign="center">
            <Text fontSize="sm">© {new Date().getFullYear()} Mi App. Todos los derechos reservados.</Text>
        </Box>
    );
};

export default Footer;