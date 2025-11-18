import { Box, Text, useColorModeValue } from "@chakra-ui/react";

const Footer = () => {
    const bgColor = useColorModeValue('secondary.900', 'secondary.900');
    const colorText = useColorModeValue('white', 'white');
    const borderColor = useColorModeValue('transparent', 'white');
    return (
        <Box
            position={'fixed'}
            bottom={0}
            w="100%"
            zIndex={1000}
            left={0}
            right={0}
            bg={bgColor}
            color={colorText}
            py={3}
            textAlign="center"
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDir={'row'}
            flexWrap={'wrap'}
            borderColor={borderColor}
            borderWidth={'1px'}
            borderBottom={0}
            borderLeft={0}
            borderRight={0}
            borderStyle={"solid"}
        >
            <Text fontSize={{ base: "sm", md: "md" }} textAlign={"center"}>© {new Date().getFullYear()} EduTest Demo. Todos los derechos reservados.</Text>
        </Box>
    );
};

export default Footer;