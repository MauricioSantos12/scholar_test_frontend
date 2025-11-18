import { Button, Container, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import UniIcon from "../utils/UniIcon.jsx";
import UseFetch from '../utils/UseFetch.js';
import { styleTypes } from '../utils/constants.jsx';
import { speakText } from '../utils/useSpeech.jsx';

const StudentTests = () => {
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataTestTypes, loading: loadingTestTypes, error: errorTestTypes, fetchData: fetchTestTypes } = UseFetch()

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorCards = useColorModeValue('white', 'secondary.900');



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
    const titleText = 'Tests Disponibles';
    const descriptionText = 'Selecciona un test para comenzar';
    return (
        <Stack direction={'row'} flexWrap={'wrap'} gap={0} p={0} m={0} h="auto" w='100%' >
            <Container maxW={'container.xl'} w='100%' h='auto' p={8} gap={4} display={'flex'} flexDir={'column'}>
                <Stack my={4} h={'auto'}>
                    <Heading color={colorDarkText} fontWeight={'bold'} fontSize={{ base: '1.3rem', md: '1.5rem' }}>{titleText} <UniIcon onClick={() => speakText(titleText)} cursor={'pointer'} icon={'UilVolume'} size={4} /></Heading>
                    <Text color={colorText} fontSize={{ base: 'md', md: 'xl' }}>{descriptionText}
                        <UniIcon onClick={() => speakText(descriptionText)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                    </Text>
                </Stack>
                <Stack direction='row' flexWrap='wrap' gap={4} justifyContent={'flex-start'} alignItems={'center'}>
                    {
                        dataTests && dataTests.length > 0 && (
                            dataTests.map((item, index) => {
                                const style = styleTypes.find((type) => type.id === item.type_id);

                                return (
                                    <Stack key={`card-test-${index}`} w={'100%'} minW={{ base: '100%', md: '300px' }} maxW={{ base: '90%', md: '500px' }} px={6} py={8} bgColor={bgColorCards} borderRadius={8} spacing={4} border={'1px solid'} borderColor={'gray.100'} boxShadow={'lg'} flexDir='row' justifyContent={'space-between'} alignItems='flex-start' _hover={{
                                        borderColor: 'primary.500',
                                        transition: 'all 0.3s ease-in-out'
                                    }}>
                                        <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'} w='100%'>
                                            <Stack flexDir={'row'} w='100%' alignItems={'flex-start'} justifyContent={'space-between'}>
                                                <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'} >
                                                    <Stack flexDir='row' w='100%' alignItems={'center'} justifyContent={'space-between'}>
                                                        <Text fontWeight={'semibold'} fontSize={{ base: '1rem', md: '1.4rem' }} color={colorDarkText}>{item.name}</Text>
                                                        <Text textAlign={'justify'} fontSize={'0.7rem'} color={style.color} bgColor={style.bgColor} py={1} px={2} borderRadius={8} border={'1px solid'} borderColor={style.borderColor} >{dataTestTypes && dataTestTypes.length > 0 ? dataTestTypes.find((type) => type.id === item.type_id)?.name : item.type_id}</Text>
                                                    </Stack>
                                                    <Text color={colorText} fontSize={'0.9rem'} fontWeight={'normal'} textAlign={'justify'}>{item.description}

                                                        <UniIcon onClick={() => speakText(item.description)} cursor={'pointer'} icon={'UilVolume'} size={4} />

                                                    </Text>
                                                </Stack>
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