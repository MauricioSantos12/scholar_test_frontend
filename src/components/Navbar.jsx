import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useAuth } from "../context/useAuth";
import UniIcon from "../utils/UniIcon";

const Navbar = () => {
    const { user, logout } = useAuth();
    
    return (
        <Box bg="white" px={6} py={4} borderBottom={"1px solid #e2e8f0"}>
            <Flex justify="space-between" align="center">
            <Stack flexDir="row" spacing={2} alignItems={'center'} justifyContent={'center'}>
            <Box bgColor={'primary.100'} py={2} px={3} borderRadius={'50%'}>
                        <UniIcon icon={'UilGraduationCap'} size={8} color='primary.500' cursor={'pointer'} />
                    </Box>
            <Text fontSize="xl" fontWeight="bold">EduTest</Text>
            </Stack>
                <Stack flexDir="row" spacing={6} alignItems={'center'} justifyContent={'center'}>
                    {
                        user && user.name && user.last_name && (
                            <Text fontWeight={"bold"}>{`${user.name} ${user.last_name}`}</Text>
                        )
                    }
                <Button minH={12} onClick={logout} leftIcon={<UniIcon icon="UilSignOutAlt" />} colorScheme="teal" variant="gray" size="sm">
                    Salir
                </Button>
                </Stack>
                
            </Flex>
        </Box>
    );
};

export default Navbar;