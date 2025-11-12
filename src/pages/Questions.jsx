import { Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading.jsx';

const Questions = () => {
    const { data: dataQuestions, loading: loadingQuestions, error: errorQuestions, fetchData: fetchQuestions } = UseFetch()

    useEffect(() => {

        fetchQuestions({
            url: '/questions',
            method: 'GET',
        });
    }, [fetchQuestions]);


    if (loadingQuestions) return <Loading />;
    if (errorQuestions) return <Text color={'red.500'}>Error: {errorQuestions}</Text>;

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            <Heading color={'dark_text'} fontSize={{ base: 'xl', md: '3xl' }}>Preguntas</Heading>
            <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todas las preguntas creadas</Text>
            {
                (!dataQuestions || dataQuestions.length === 0) && (
                    <Text color={'text'} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado preguntas</Text>
                )
            }
            {
                dataQuestions && dataQuestions.length > 0 && (
                    <TableContainer w={'100%'}>
                        <Table variant='simple' size={'lg'}>
                            <Thead>
                                <Tr>
                                    <Th textAlign={'center'}>Texto Pregunta</Th>
                                    <Th textAlign={'center'}>Texto alternativo</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {dataQuestions.map((data, i) => (
                                    <Tr key={data._id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                                        <Td textAlign={'center'}>{data.first_text && data.first_text.length > 50 ? data.first_text.substring(0, 50) + '...' : data.first_text}</Td>
                                        <Td textAlign={'center'}>{data.second_Text && data.second_Text.length > 50 ? data.second_Text.substring(0, 50) + '...' : data.second_Text}</Td>
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

export default Questions