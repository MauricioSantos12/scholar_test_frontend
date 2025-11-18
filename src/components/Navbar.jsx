import { Box, Button, Flex, Popover, PopoverContent, PopoverTrigger, Stack, Switch, Text, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "../context/useAuth";
import UniIcon from "../utils/UniIcon";
import FontSizeAdjuster from "./FontSizeAdjuster";

const Navbar = () => {
    const { user, logout } = useAuth();
    const { colorMode, toggleColorMode } = useColorMode()
    const bgColor = useColorModeValue('white', 'secondary.900');
    const colorText = useColorModeValue('text', 'secondary.200');
    return (
        <Box bg={bgColor} px={{ base: 3, md: 6 }} py={{ base: 2, md: 4 }} borderBottom={"1px solid #e2e8f0"} >
            <Flex justify="space-between" align="center">
                <Stack flexDir="row" spacing={{ base: 1, md: 2 }} alignItems={'center'} justifyContent={'center'}>
                    <Box bgColor={bgColor} py={{ base: 1, md: 2 }} px={{ base: 2, md: 3 }} borderRadius={'50%'}>
                        <UniIcon icon={'UilGraduationCap'} size={{ base: 6, md: 8 }} color='primary.500' cursor={'pointer'} />
                    </Box>
                    <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="bold" colorText>EduTest</Text>
                </Stack>
                <Popover>
                    <PopoverTrigger>
                        <Stack flexDir="row" spacing={0} alignItems={'center'} justifyContent={'center'} cursor={'pointer'}>
                            {
                                user && user.name && (
                                    <Text fontSize={'sm'} colorText>{`${user?.name} ${user?.last_name}`}</Text>
                                )
                            }
                            <UniIcon icon={'UilAngleDown'} size={6} color={colorText} />

                        </Stack>
                    </PopoverTrigger>
                    <PopoverContent w={'fit-content'}>
                        <Stack w={'100%'} p={4} gap={2} alignItems={'center'} justifyContent={'center'}>
                            <FontSizeAdjuster />
                            <Stack flexDir={'row'} alignItems={'center'} justifyContent={'center'} w={'100%'}>
                                <Text fontSize={'xs'}>Modo Oscuro</Text>
                                <Switch colorScheme="teal" defaultChecked={colorMode === 'ligth'} onChange={toggleColorMode} />
                            </Stack>
                            <Stack flexDir={'row'} alignItems={'center'} justifyContent={'center'} w={'100%'} onClick={logout} cursor={'pointer'} _hover={{ color: 'primary.500' }} transition={'all 0.3s ease-in-out'}>
                                <Text fontSize={'xs'}>Salir</Text>
                                <UniIcon icon="UilSignOutAlt" size={4} />
                            </Stack>
                        </Stack>

                    </PopoverContent>
                </Popover>

            </Flex>
        </Box >
    );
};

export default Navbar;