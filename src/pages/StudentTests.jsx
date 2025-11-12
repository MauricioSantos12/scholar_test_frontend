import { Button, Container, Heading, Stack, Text } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import UniIcon from "../utils/UniIcon.jsx";
import UseFetch from '../utils/UseFetch.js';
import { styleTypes } from '../utils/constants.jsx';

const StudentTests = () => {
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataTestTypes, loading: loadingTestTypes, error: errorTestTypes, fetchData: fetchTestTypes } = UseFetch()
    useEffect(() => {
        fetchTests({
            url: '/tests',
            method: 'GET',
        });
        fetchTestTypes({
            url: '/testtypes',
            method: 'GET',
        });

    }, [fetchTests, fetchTestTypes]);

    const navigate = useNavigate();




    if (loadingTests || loadingTestTypes) return <Loading />;
    if (errorTests || errorTestTypes) return <Text color={'red.500'}>Error: {errorTests || errorTestTypes}</Text>;
    return (
        <Stack direction={'row'} flexWrap={'wrap'} gap={0} p={0} m={0} h="auto" w='100%' >
            <Container maxW={'container.xl'} w='100%' h='auto' p={8} gap={4} display={'flex'} flexDir={'column'}>
                <Stack my={4} h={'auto'}>
                    <Heading color={'dark_text'} fontWeight={'bold'} fontSize={{ base: '1.3rem', md: '1.5rem' }}>Tests Disponibles</Heading>
                    <Text color={'text'} fontSize={{ base: 'md', md: 'xl' }}>Selecciona un test para comenzar</Text>
                </Stack>
                <Stack direction='row' flexWrap='wrap' gap={4} justifyContent={'flex-start'} alignItems={'center'}>
                    {
                        dataTests && dataTests.length > 0 && (
                            dataTests.map((item, index) => {
                                const style = styleTypes.find((type) => type.id === item.type_id);

                                return (
                                    <Stack key={`card-test-${index}`} w={'100%'} minW={{ base: '100%', md: '300px' }} maxW={{ base: '90%', md: '500px' }} px={6} py={8} bgColor={'white'} borderRadius={8} spacing={4} border={'1px solid'} borderColor={'gray.100'} boxShadow={'lg'} flexDir='row' justifyContent={'space-between'} alignItems='flex-start' _hover={{
                                        borderColor: 'primary.500',
                                        transition: 'all 0.3s ease-in-out'
                                    }}>
                                        <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'} w='100%'>
                                            <Stack flexDir={'row'} w='100%' alignItems={'flex-start'} justifyContent={'space-between'}>
                                                <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'}>
                                                    <Text fontWeight={'semibold'} fontSize={'1.7rem'} color={'#344256'}>{item.name}</Text>
                                                    <Text color={'#65758b'} fontSize={'0.9rem'} fontWeight={'normal'}>{item.description}</Text>
                                                </Stack>
                                                <Text color={style.color} bgColor={style.bgColor} py={1} px={2} borderRadius={8} border={'1px solid'} borderColor={style.borderColor} >{dataTestTypes && dataTestTypes.length > 0 ? dataTestTypes.find((type) => type.id === item.type_id)?.name : item.type_id}</Text>
                                            </Stack>

                                            <Button w={'100%'} variant={"solid"} leftIcon={<UniIcon icon={'UilPlayCircle'} />} onClick={() => navigate(`/studenttest/${item.id}`)} >Comenzar test</Button>
                                        </Stack>

                                    </Stack>
                                )
                            })
                        )
                    }

                </Stack>
            </Container>
        </Stack>
    )
}

export default StudentTests