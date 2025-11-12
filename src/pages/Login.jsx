import { Box, Button, Heading, Input, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useAuth } from "../context/useAuth";
import UniIcon from '../utils/UniIcon';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const handleLogin = async () => {
        setError('');
        if (email && password) {
            const data = await login(email, password);
            console.log({ data })
            if (!data) {
                setError('Credenciales incorrectas')
            }
            console.log({ data })
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
    return (
        <Box minH="100vh" display="flex" flexDirection="column" justifyContent={'center'} alignItems={'center'} bgColor={'#f8fafc'} onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
            <Stack h='auto' w={'100%'} p={8} maxW={{ base: '90%', md: '600px' }} m='0 auto' bgColor='white' borderRadius={8} boxShadow='lg' gap={2} border={'1px solid'} borderColor={'secondary.500'}>
                <Stack dir='column' justifyContent={'center'} alignItems={'center'}>
                    <Box bgColor={'primary.100'} py={4} px={5} borderRadius={'50%'}>
                        <UniIcon icon={'UilGraduationCap'} size={12} color='primary.500' cursor={'pointer'} />
                    </Box>
                </Stack>
                <Stack dir='column' justifyContent={'center'} alignItems={'center'} gap={2}>
                    <Heading color={'dark_text'} fontWeight={'bold'} fontSize={{ base: '1.5rem', md: '2rem' }}>EduTest</Heading>
                    <Text color={'text'} fontSize={{ base: '0.9rem', md: '1.3rem' }}>Sistema de Gestión de Tests Educativos</Text>
                </Stack>
                <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={2}>
                    <Text color={'dark_text'} fontWeight={'bold'} fontSize={'1.2rem'}>Email</Text>
                    <Input variant='outline' placeholder='tu@email.com' bgColor={'#F8FAFC'} p={2} fontSize={{ base: '1rem', md: '1.3rem' }} minH={12} type='email' onChange={(e) => setEmail(e.target.value)} />
                </Stack>
                <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'} gap={2}>
                    <Text color={'dark_text'} fontWeight={'bold'} fontSize={'1.2rem'} >Contraseña</Text>
                    <Input variant='outline' placeholder='********' bgColor={'#F8FAFC'} p={2} fontSize={{ base: '1rem', md: '1.3rem' }} minH={12} type='password' onChange={(e) => setPassword(e.target.value)} />
                </Stack>
                {
                    error && (
                        <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'}>
                            <Text color={'red'} fontSize={'1rem'} >{error}</Text>
                        </Stack>
                    )
                }

                <Stack dir='column' justifyContent={'center'} alignItems={'flex-start'}>
                    <Button variant='solid' size={'lg'} w='100%' fontWeight={'semibold'} h={12} minH={12} onClick={handleLogin} isLoading={loading}>Entrar</Button>
                </Stack>


            </Stack>
        </Box>
    )
}

export default Login