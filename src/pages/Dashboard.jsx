import { Stack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import UseFetch from '../utils/UseFetch';
import Card from '../components/Card.jsx';
import Loading from '../components/Loading.jsx';

const Dashboard = () => {
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchAreas } = UseFetch()
    const { data: dataComponents, loading: loadingComponents, error: errorComponents, fetchData: fetchComponents } = UseFetch()
    const { data: dataQuestions, loading: loadingQuestions, error: errorQuestions, fetchData: fetchQuestions } = UseFetch()
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    useEffect(() => {
        fetchTests({
            url: '/tests',
            method: 'GET',
        });
        fetchAreas({
            url: '/areas',
            method: 'GET',
        });
        fetchComponents({
            url: '/components',
            method: 'GET',
        });
        fetchQuestions({
            url: '/questions',
            method: 'GET',
        });
        fetchUsers({
            url: '/users',
            method: 'GET',
        });

    }, [fetchTests, fetchAreas, fetchComponents, fetchQuestions, fetchUsers]);
    if (loadingTests || loadingAreas || loadingComponents || loadingQuestions || loadingUsers) return <Loading />;
    if (errorTests || errorAreas || errorComponents || errorQuestions || errorUsers) return <Text color={'red.500'}>Error: {errorTests || errorAreas || errorComponents || errorQuestions || errorUsers}</Text>;
    const dataCards = [
        {
            title: 'Tests Creados',
            icon: 'UilDashboard',
            value: dataTests?.length || 0,
            bgColor: 'purple.50',
            colorIcon: 'purple.500'
        },
        {
            title: 'Áreas',
            icon: 'UilClipboardAlt',
            value: dataAreas?.length || 0,
            bgColor: 'gray.50',
            colorIcon: 'gray.500'
        },
        {
            title: 'Componentes',
            icon: 'UilGold',
            value: dataComponents?.length || 0,
            bgColor: 'purple.50',
            colorIcon: 'purple.500'
        },
        {
            title: 'Preguntas',
            icon: 'UilQuestionCircle',
            value: dataQuestions?.length || 0,
            bgColor: 'gray.50',
            colorIcon: 'gray.500'
        },
        {
            title: 'Usuarios',
            icon: 'UilUsersAlt',
            value: dataUsers?.length || 0,
            bgColor: 'orange.50',
            colorIcon: 'orange.500'
        },
    ]
    return (
        <Stack direction='row' flexWrap='wrap' gap={4} justifyContent={'center'} alignItems={'center'}>
            {
                dataCards && (
                    dataCards.map((item, index) => (
                        <Card key={index} icon={item.icon} title={item.title} value={item.value} bgColor={item.bgColor} colorIcon={item.colorIcon} />
                    ))
                )
            }

        </Stack>
    )
}

export default Dashboard