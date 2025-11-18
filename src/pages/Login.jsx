import { Box, Button, Heading, Input, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useAuth } from "../context/useAuth";
import UniIcon from '../utils/UniIcon';
import InputText from '../components/InputText';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const handleLogin = async () => {
        setError('');
        if (email && password) {
            const data = await login(email, password);
            if (!data) {
                setError('Credenciales incorrectas')
            }
            if (data && data?.user) {
                const { role } = data.user;
                switch (role) {
                    case 'admin':
                        window.location.href = '/dashboard';
                        break;
                    case 'student':
                        window.location.href = '/studenttests';
                        break;
                    default:
                        setError('Credenciales incorrectas');
                }
            }

        } else {
            setError('Email y contraseña son requeridos')
        }
    }

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorCardColorMode = useColorModeValue('white', 'secondary.800');
    return (
        <Box minH="100vh" display="flex" flexDirection="column" justifyContent={'center'} alignItems={'center'} bgColor={bgColorColorMode} onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
            <Stack h='auto' w={'100%'} py={10} px={6} maxW={{ base: '90%', md: '600px' }} m='0 auto' bgColor={bgColorCardColorMode} borderRadius={8} boxShadow='lg' gap={2} border={'1px solid'} borderColor={'secondary.500'}>
                <Stack dir='column' justifyContent={'center'} alignItems={'center'}>
                    <Box bgColor={'primary.100'} py={3} px={4} borderRadius={'50%'}>
                        <UniIcon icon={'UilGraduationCap'} size={10} color='primary.500' cursor={'pointer'} />
                    </Box>
                </Stack>
                <Stack dir='column' justifyContent={'center'} alignItems={'center'} gap={2}>
                    <Heading color={colorDarkText} fontWeight={'bold'} fontSize={{ base: 'xl', md: '3xl' }}>EduTest</Heading>
                    <Text color={colorText} fontSize={{ base: 'md', md: 'xl' }} textAlign={'center'}>Sistema de Gestión de Tests Educativos</Text>
                </Stack>
                <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={4} w='100%'>
                    <InputText text={`Email`} placeholder={`example@example.com`} type={'email'} value={email} setValue={setEmail} />
                    <InputText text={`Contraseña`} placeholder={`********`} type={'password'} value={password} setValue={setPassword} />
                    {
                        error && (
                            <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'}>
                                <Text color={'red'} fontSize={'1rem'} >{error}</Text>
                            </Stack>
                        )
                    }
                    <Button variant='solid' size={'lg'} w='100%' fontWeight={'semibold'} h={12} minH={12} onClick={handleLogin} isLoading={loading}>Entrar</Button>
                </Stack>

            </Stack>
        </Box>
    )
}

export default Login