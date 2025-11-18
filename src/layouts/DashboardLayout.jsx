import { Container, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import UniIcon from '../utils/UniIcon';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/useAuth";

const DashboardLayout = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [selectedView, setSeletecView] = useState('Dashboard');
    const items = user && user.role === 'admin' ? [
        {
            name: 'Dashboard',
            icon: 'UilDashboard',
            component: 'dashboard'
        },
        {
            name: 'Tipos de pruebas',
            icon: 'UilBars',
            component: 'testTypes'
        },
        {
            name: 'Tests',
            icon: 'UilClipboardAlt',
            component: 'tests'
        },
        {
            name: 'Áreas',
            icon: 'UilLayerGroup',
            component: 'areas'
        },
        {
            name: 'Componentes',
            icon: 'UilGold',
            component: 'components'
        },
        // {
        //     name: 'Preguntas',
        //     icon: 'UilQuestionCircle',
        //     component: 'questions'
        // },
        {
            name: 'Users',
            icon: 'UilUsersAlt',
            component: 'users'
        },
        {
            name: 'Resutados',
            icon: 'UilCheckCircle',
            component: 'results'
        },
        {
            name: 'Observaciones',
            icon: 'UilAdjustCircle',
            component: 'recommendations'
        },
        {
            name: 'Métricas',
            icon: 'UilGraphBar',
            component: 'metrics'
        },
    ] : [
        {
            name: 'Tests',
            icon: 'UilDashboard',
            component: 'studenttests'
        }
    ]
    const { isOpen, onOpen, onClose } = useDisclosure()
    const bgColor = useColorModeValue('white', 'secondary.900');


    return (
        <Stack direction={'row'} flexWrap={'wrap'} gap={0} p={0} m={0} h="100%" w='100%' >
            <Stack h="100%" w={{ base: '50px', md: '250px' }} borderColor='#dee6ed' bgColor={bgColor} overflow={'hidden'} pt={5} px={2} >
                {
                    items.map((item, index) => (
                        <>
                            <Stack
                                display={{ base: 'none', md: 'flex' }}
                                onClick={() => { navigate(`/${item.component}`); setSeletecView(item.name) }}
                                flexDir={'row'}
                                key={index}
                                bgColor={selectedView === item.name ? 'primary.500' : ''}
                                color={selectedView === item.name ? 'white' : ''}
                                px={4}
                                py={2}
                                borderRadius={6}
                                _hover={{ bgColor: 'primary.100', color: 'primary.500', cursor: 'pointer' }}
                                justifyContent={{ base: 'center', md: 'flex-start' }}
                            >
                                <UniIcon icon={item.icon} />
                                <Text display={{ base: 'none', md: 'block' }}>{item.name}</Text>
                            </Stack>
                            <Stack
                                display={{ base: 'flex', md: 'none' }}
                                onClick={() => { onOpen() }}
                                flexDir={'row'}
                                key={index}
                                bgColor={selectedView === item.name ? 'primary.500' : ''}
                                color={selectedView === item.name ? 'white' : ''}
                                px={4}
                                py={2}
                                borderRadius={6}
                                _hover={{ bgColor: 'primary.100', color: 'primary.500', cursor: 'pointer' }}
                                justifyContent={{ base: 'center', md: 'flex-start' }}
                            >
                                <UniIcon icon={item.icon} />
                                <Text display={{ base: 'none', md: 'block' }}>{item.name}</Text>
                            </Stack>
                        </>
                    ))
                }
            </Stack>
            <Stack h="100%" w={{ base: 'calc(100% - 50px)', md: 'calc(100% - 250px)' }} p={4}>
                <Container maxW={'container.xl'} w='100%' h='100%'>
                    <Stack borderRadius={16} bgColor={bgColor} p={8} boxShadow={'xl'} h={'auto'}>
                        {children}
                    </Stack>

                </Container>
            </Stack>
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Menú</DrawerHeader>

                    <DrawerBody>
                        {
                            items.map((item, index) => (
                                <Stack
                                    onClick={() => { onClose(); navigate(`/${item.component}`); setSeletecView(item.name); }}
                                    flexDir={'row'}
                                    key={index}
                                    bgColor={selectedView === item.name ? 'primary.500' : ''}
                                    color={selectedView === item.name ? 'white' : ''}
                                    px={4}
                                    py={2}
                                    borderRadius={6}
                                    _hover={{ bgColor: 'primary.100', color: 'primary.500', cursor: 'pointer' }}
                                    justifyContent={'flex-start'}
                                >
                                    <UniIcon icon={item.icon} />
                                    <Text>{item.name}</Text>
                                </Stack>
                            ))
                        }
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Stack>
    )
}

export default DashboardLayout