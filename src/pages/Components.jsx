import { Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading';

const Components = () => {
    const { data: dataComponents, loading: loadingComponents, error: errorComponents, fetchData: fetchComponents } = UseFetch()

    useEffect(() => {
        fetchComponents({
            url: '/components',
            method: 'GET',
        });
    }, [fetchComponents]);



    if (loadingComponents) return <Loading />;
    if (errorComponents) return <Text color={'red.500'}>Error: {errorComponents}</Text>;

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={'dark_text'} fontSize={{ base: '1.5rem', md: '2rem' }}>Competencias</Heading>
            <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>Listado de todas las competencias creadas</Text>
            {
                (!dataComponents || dataComponents.length === 0) && (
                    <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>No se han creado competencia</Text>
                )
            }
            {
                dataComponents && dataComponents.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Nombre</Th>
                                    <Th textAlign={'center'}>Descripcion</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {dataComponents.map((data, i) => (
                                    <Tr key={data._id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                                        <Td textAlign={'center'}>{data.name}</Td>
                                        <Td textAlign={'center'}>{data.description && data.description.length > 100 ? data.description.substring(0, 100) + '...' : data.description}</Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                )
            }
        </Stack>
    )
}

export default Components