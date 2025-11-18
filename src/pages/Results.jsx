import { Button, Heading, Input, Select, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading';
import Paginator from '../components/Paginator';
import UniIcon from '../utils/UniIcon';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Results = () => {
    const { data: dataResults, loading: loadingResults, error: errorResults, fetchData: fetchResults } = UseFetch()
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    const [page, setPage] = useState(1);
    const [userFilter, setUserFilter] = useState('');
    const [testFilter, setTestFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [doFilter, setDoFilter] = useState(false);
    const showToast = useToast();

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
        if (userFilter || testFilter || statusFilter || startDate || endDate) {
            setDoFilter(true);
        }
    }, [userFilter, testFilter, statusFilter, startDate, endDate])

    useEffect(() => {

        fetchResultsFn();
    }, [fetchResults, page]);

    const fetchResultsFn = () => {
        const urlParams = new URLSearchParams();
        if (page) urlParams.append('page', page);
        if (userFilter) urlParams.append('user_id', userFilter);
        if (testFilter) urlParams.append('test_id', testFilter);
        if (statusFilter) urlParams.append('status', statusFilter);
        if (startDate) urlParams.append('startDate', startDate);
        if (endDate) urlParams.append('endDate', endDate);
        if (startDate && endDate) {
            const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);
            if (endDateObject.getTime() < startDateObject.getTime()) {
                showToast({
                    title: "No se puede filtrar",
                    description: "La fecha de fin debe ser posterior a la de inicio",
                    status: "error",
                    isClosable: true,
                })
                return;
            }
        }

        fetchResults({
            url: `/results?${urlParams.toString()}`,
            method: 'GET',
        });
    }

    const parsedStatus = [
        {
            name: 'Todos',
            value: '',
        },
        {
            name: 'Completado',
            value: 'completed',
        },
        {
            name: 'Incompleto',
            value: 'incomplete',
        },
        {
            name: 'En progreso',
            value: 'in_progress',
        }, {
            name: 'Expirado',
            value: 'expired',
        }
    ]

    const handleExport = () => {
        const data = dataResults.data;
        console.log({ dataTests })
        console.log({ dataUsers })
        const parsedData = data.map((result) => {
            console.log({ result })
            return {
                ...result,
                test_name: dataTests.find((test) => test.id === result.test_id)?.name || '',
                user_name: dataUsers.find((user) => user.id === result.user_id)?.name || '',
                user_last_name: dataUsers.find((user) => user.id === result.user_id)?.last_name || '',
            }
        });
        parsedData.forEach((result) => {
            result.status = result.status === 'completed' ? 'Completado' : result.status === 'incomplete' ? 'Incompleto' : result.status === 'in_progress' ? 'En progreso' : 'Expirado';
            result.user_name = `${result.user_name} ${result.user_last_name}`.trim();
            delete result.user_last_name;
            if (result.test_id) {
                delete result.test_id;

            }
            if (result.user_id) {
                delete result.user_id;
            }
        });
        const ws = XLSX.utils.json_to_sheet(parsedData);
        const wb = XLSX.utils.book_new();
        const sheetName = 'Resultados';
        const fileName = 'Resultados';
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(dataBlob, `${fileName}.xlsx`);
    };

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

    if (loadingResults || loadingTests || loadingUsers) return <Loading />;
    if (errorResults || errorTests || errorUsers) return <Text color={'red.500'}>Error: {errorResults || errorTests || errorUsers}</Text>;
    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Resultados</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de resultados</Text>
            <Stack w='100%' gap={2}>
                <Text color={colorDarkText} fontWeight={'bold'} >Filtros</Text>
                <Stack direction={'row'} justifyContent={'flex-strt'} w={'100%'}>
                    {

                        <Stack>
                            <Text>Estado</Text>
                            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value={null}>Selecciona un estado</option>
                                {
                                    parsedStatus.map((status) => (
                                        <option key={status.value} value={status.value}>{status.name}</option>
                                    ))
                                }

                            </Select>
                        </Stack>

                    }
                    {
                        dataTests && dataTests.length > 0 && (
                            <Stack>
                                <Text>Test</Text>
                                <Select value={testFilter} onChange={(e) => setTestFilter(e.target.value)}>
                                    <option value={null}>Selecciona un test</option>
                                    {
                                        dataTests.map((test) => (
                                            <option key={test.name} value={test.id}>{test.name}</option>
                                        ))
                                    }

                                </Select>
                            </Stack>
                        )
                    }
                    {
                        dataUsers && dataUsers.length > 0 && (
                            <Stack>
                                <Text>Usuario</Text>
                                <Select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
                                    <option value={null}>Selecciona un usuario</option>
                                    {
                                        dataUsers.map((user) => (
                                            <option key={user.name} value={user.id}>{user.name}</option>
                                        ))
                                    }

                                </Select>
                            </Stack>
                        )
                    }
                    <Stack>
                        <Text>Fecha de inicio</Text>
                        <Input placeholder='Fecha de inicio' value={startDate} onChange={(e) => setStartDate(e.target.value)} size='md' type='date' />
                    </Stack>
                    <Stack>
                        <Text>Fecha de fin</Text>
                        <Input placeholder='Fecha de fin' value={endDate} onChange={(e) => setEndDate(e.target.value)} size='md' type='date' />
                    </Stack>

                </Stack>
                <Stack flexDir={'row'} gap={2} w={'100%'} justifyContent={'space-between'} alignItems={'center'}>
                    <Button size='sm' disabled={!doFilter} variant={'gray'} w='fit-content' onClick={() => fetchResultsFn()} >Filtrar</Button>
                    <Button size='sm' variant={'gray'} w='fit-content' onClick={() => handleExport()} >Exportar</Button>
                </Stack>
            </Stack>

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
                                        const test = dataTests && dataTests.length > 0 && dataTests.find((test) => test.id === data.test_id);
                                        const user = dataUsers && dataUsers.length > 0 && dataUsers.find((user) => user.id === data.user_id);
                                        const status = parsedStatus.find((status) => status.value === data.status);
                                        return (
                                            <Tr key={data.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                                <Td textAlign={'center'}>{test && test.name}</Td>
                                                <Td textAlign={'center'}>{user && `${user.name} ${user?.lastName || ''}`}</Td>
                                                <Td textAlign={'center'}>{data.score}</Td>
                                                <Td textAlign={'center'}>{status?.name}</Td>
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