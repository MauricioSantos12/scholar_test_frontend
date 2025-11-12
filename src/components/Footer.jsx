import { Box, Text } from "@chakra-ui/react";

const Footer = () => {
    return (
        <Box bg="gray.800" color="white" py={3} textAlign="center" display={"flex"} justifyContent={"center"} alignItems={"center"} flexDir={'row'} flexWrap={'wrap'}>
            <Text fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>© {new Date().getFullYear()} EduTest Demo. Todos los derechos reservados.</Text>
        </Box>
    );
};

export default Footer;