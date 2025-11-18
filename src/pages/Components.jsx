import { Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
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

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

    if (loadingComponents) return <Loading />;
    if (errorComponents) return <Text color={'red.500'}>Error: {errorComponents}</Text>;

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Componentes</Heading>
            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todas las componentes creadas</Text>
            {
                (!dataComponents || dataComponents.length === 0) && (
                    <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado componentes</Text>
                )
            }
            {
                dataComponents && dataComponents.length > 0 && (
                    <TableContainer w={'100%'} color={colorText}>
                        <Table variant='simple' size={'lg'} color={colorText}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Nombre</Th>
                                    <Th textAlign={'center'}>Descripcion</Th>

                                </Tr>
                            </Thead>
                            <Tbody>
                                {dataComponents.map((data, i) => (
                                    <Tr key={data._id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
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