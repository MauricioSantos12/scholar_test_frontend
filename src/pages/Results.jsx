import { Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading';
import Paginator from '../components/Paginator';
import UniIcon from '../utils/UniIcon';
import { useNavigate } from 'react-router-dom';

const Results = () => {
    const { data: dataResults, loading: loadingResults, error: errorResults, fetchData: fetchResults } = UseFetch()
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {

        fetchTests({
            url: '/tests',
            method: 'GET',
        });
        fetchUsers({
            url: '/users',
            method: 'GET',
        });
    }, [fetchUsers, fetchTests]);
    useEffect(() => {
        fetchResults({
            url: '/results?page=' + page,
            method: 'GET',
        });

    }, [fetchResults, page]);

    const parsedStatus = {
        'completed': 'Completado',
        'incomplete': 'Incompleto',
        'in_progress': 'En progreso'
    }

    if (loadingResults || loadingTests || loadingUsers) return <Loading />;
    if (errorResults || errorTests || errorUsers) return <Text color={'red.500'}>Error: {errorResults || errorTests || errorUsers}</Text>;
    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={'dark_text'} fontSize={{ base: 'xl', md: '3xl' }}>Resultados</Heading>
            <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de resultados</Text>
            {
                (!dataResults || dataResults && dataResults.data.length === 0) && (
                    <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han generado resultados</Text>
                )
            }
            {
                dataResults && dataResults.data && dataResults.data.length > 0 && (
                    <>
                        <TableContainer w={'100%'}>
                            <Table variant='simple' size={'lg'}>
                                <Thead>
                                    <Tr>
                                        <Th textAlign={'center'}>Test</Th>
                                        <Th textAlign={'center'}>User</Th>
                                        <Th textAlign={'center'}>Puntaje</Th>
                                        <Th textAlign={'center'}>Estado</Th>
                                        <Th textAlign={'center'}>Acciones</Th>

                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {dataResults.data.map((data, i) => {
                                        if (!data) return;
                                        const test = dataTests && dataTests.length > 0 && dataTests.find((test) => test._id === data.test);
                                        const user = dataUsers && dataUsers.length > 0 && dataUsers.find((user) => user._id === data.user);
                                        return (
                                            <Tr key={data._id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                                                <Td textAlign={'center'}>{test && test.name}</Td>
                                                <Td textAlign={'center'}>{user && `${user.name} ${user?.lastName || ''}`}</Td>
                                                <Td textAlign={'center'}>{data.score}</Td>
                                                <Td textAlign={'center'}>{parsedStatus[data.status]}</Td>
                                                <Td textAlign={'center'} onClick={() => data.status === 'completed' && navigate(`/results/${data.id}`)} ><UniIcon size={5} icon={'UilEye'} color={data.status === 'completed' ? 'primary.500' : 'gray'} cursor={data.status === 'completed' ? 'pointer' : 'not-allowed'} /></Td>
                                            </Tr>
                                        )
                                    })}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Paginator totalPages={dataResults.totalPages} setPage={setPage} page={page} />
                    </>
                )
            }
        </Stack>
    )
}

export default Results