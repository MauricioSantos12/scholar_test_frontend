import { Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading.jsx';

const Areas = () => {
  const { data: dataAreas, loading: loadingAreas, error: errorAreas, fetchData: fetchAreas } = UseFetch()

  useEffect(() => {
    fetchAreas({
      url: '/areas',
      method: 'GET',
    });
  }, [fetchAreas]);

  if (loadingAreas) return <Loading />;
  if (errorAreas) return <Text color={'red.500'}>Error: {errorAreas}</Text>;

  return (
    <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
      <Heading color={'dark_text'} fontSize={{ base: '1.5rem', md: '2rem' }}>Áreas</Heading>
      <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>Listado de todas las áreas creadas</Text>

      {
        (!dataAreas || dataAreas.length === 0) && (
          <Text color={'text'} fontSize={{ base: '0.8rem', md: '1.2rem' }}>No se han creado áreas</Text>
        )
      }
      {
        dataAreas && dataAreas.length > 0 && (
          <TableContainer w={'100%'}>
            <Table variant='simple' size={'lg'}>
              <Thead>
                <Tr>
                  <Th textAlign={'center'}>Nombre</Th>
                  <Th textAlign={'center'}>Descripcion</Th>

                </Tr>
              </Thead>
              <Tbody>
                {dataAreas.map((data, i) => (
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

export default Areas