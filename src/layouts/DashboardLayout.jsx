import { Container, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import UniIcon from '../utils/UniIcon';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const [selectedView, setSeletecView] = useState('Dashboard');
    const items = [
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
            name: 'Competencias',
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
            name: 'Observaciones',
            icon: 'UilAdjustCircle',
            component: 'recommendations'
        },
        {
            name: 'Métricas',
            icon: 'UilGraphBar',
            component: 'metrics'
        },
    ]
    return (
        <Stack direction={'row'} flexWrap={'wrap'} gap={0} p={0} m={0} h="auto" w='100%' >
            <Stack h="100%" w={{ base: '50px', md: '250px' }} borderColor='#dee6ed' bgColor='white' overflow={'hidden'} pt={5} px={2} >
                {
                    items.map((item, index) => (
                        <Stack onClick={() => { navigate(`/${item.component}`); setSeletecView(item.name) }} flexDir={'row'} key={index} bgColor={selectedView === item.name ? 'primary.500' : ''} color={selectedView === item.name ? 'white' : ''} px={4} py={2} borderRadius={6} _hover={{ bgColor: 'primary.100', color: 'primary.500', cursor: 'pointer' }} >
                            <UniIcon icon={item.icon} />
                            <Text>{item.name}</Text>
                        </Stack>
                    ))
                }
            </Stack>
            <Stack h="100%" w={{ base: 'calc(100% - 50px)', md: 'calc(100% - 250px)' }} p={4}>
                <Container maxW={'container.xl'} w='100%' h='100%'>
                    <Stack borderRadius={16} bgColor={'white'} p={8} boxShadow={'xl'} h={'auto'}>
                        {children}
                    </Stack>

                </Container>
            </Stack>
        </Stack>
    )
}

export default DashboardLayout