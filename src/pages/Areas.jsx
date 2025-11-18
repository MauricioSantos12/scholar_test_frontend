import { Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
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

  const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
  const colorText = useColorModeValue('text', 'secondary.200');
  const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
  const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

  if (loadingAreas) return <Loading />;
  if (errorAreas) return <Text color={'red.500'}>Error: {errorAreas}</Text>;



  return (
    <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
      <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }}>Áreas</Heading>
      <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Listado de todas las áreas creadas</Text>

      {
        (!dataAreas || dataAreas.length === 0) && (
          <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>No se han creado áreas</Text>
        )
      }
      {
        dataAreas && dataAreas.length > 0 && (
          <TableContainer w={'100%'} color={colorText}>
            <Table variant='simple' size={'lg'}>
              <Thead color={colorDarkText}>
                <Tr>
                  <Th textAlign={'center'}>Nombre</Th>
                  <Th textAlign={'center'}>Descripcion</Th>

                </Tr>
              </Thead>
              <Tbody color={colorText}>
                {dataAreas.map((data, i) => (
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

export default Areas