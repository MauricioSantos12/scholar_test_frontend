import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useAuth } from "../context/useAuth";
import UniIcon from "../utils/UniIcon";

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <Box bg="white" px={{ base: 3, md: 6 }} py={{ base: 2, md: 4 }} borderBottom={"1px solid #e2e8f0"}>
            <Flex justify="space-between" align="center">
                <Stack flexDir="row" spacing={{ base: 1, md: 2 }} alignItems={'center'} justifyContent={'center'}>
                    <Box bgColor={'primary.100'} py={{ base: 1, md: 2 }} px={{ base: 2, md: 3 }} borderRadius={'50%'}>
                        <UniIcon icon={'UilGraduationCap'} size={{ base: 6, md: 8 }} color='primary.500' cursor={'pointer'} />
                    </Box>
                    <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold">EduTest</Text>
                </Stack>
                <Stack flexDir="row" spacing={{ base: 2, md: 4 }} alignItems={'center'} justifyContent={'center'}>
                    {
                        user && user.name && user.last_name && (
                            <Text fontWeight={"bold"} fontSize={{ base: 'sm', md: 'md' }}>{`${user.name} ${user.last_name}`}</Text>
                        )
                    }
                    <Button onClick={logout} leftIcon={<UniIcon icon="UilSignOutAlt" />} colorScheme="teal" variant="gray" size={{ base: 'sm', md: 'md' }}>
                        Salir
                    </Button>
                </Stack>

            </Flex>
        </Box>
    );
};

export default Navbar;