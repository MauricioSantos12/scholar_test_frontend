import { Button, Container, Heading, Stack, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading.jsx';
import UniIcon from "../utils/UniIcon.jsx";
import UseFetch from '../utils/UseFetch.js';
import { styleTypes } from '../utils/constants.jsx';
import { speakText } from '../utils/useSpeech.jsx';
import dayjs from 'dayjs';

const StudentTests = () => {
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataTestTypes, loading: loadingTestTypes, error: errorTestTypes, fetchData: fetchTestTypes } = UseFetch()

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorCards = useColorModeValue('white', 'secondary.900');
    const bgColorCardsDisabled = useColorModeValue('gray.200', 'secondary.800');
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    useEffect(() => {
        if (user) {
            fetchTests({
                url: `/tests/availableByUser/${user?.id}`,
                method: 'GET',
            });
        } else {
            fetchTests({
                url: '/tests',
                method: 'GET',
            });
        }

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
                <Stack my={4} h={'auto'} w='100%'>
                    <Heading color={colorDarkText} fontWeight={'bold'} fontSize={{ base: '1.3rem', md: '1.5rem' }} w='100%'>{titleText} <UniIcon onClick={() => speakText(titleText)} cursor={'pointer'} icon={'UilVolume'} size={4} /></Heading>
                    <Text color={colorText} fontSize={{ base: 'md', md: 'xl' }}>{descriptionText}
                        <UniIcon onClick={() => speakText(descriptionText)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                    </Text>
                </Stack>
                <Stack w='100%'>
                    {
                        dataTests && dataTests.length > 0 && (
                            dataTests.map((item, index) => {
                                return (
                                    <Stack key={`group-test-${index}`}>

                                        <Text>Grupo: <b>{item.name}</b></Text>
                                        <Stack direction='row' flexWrap='wrap' gap={4} justifyContent={'flex-start'} alignItems={'center'} w='100%'>
                                            {
                                                item && item.tests && item.tests.length > 0 && (
                                                    item.tests.map((test, index2) => {
                                                        const now = dayjs(new Date());
                                                        const availableFrom = dayjs(test.available_from);
                                                        const availableUntil = dayjs(test.available_until);
                                                        const isAvailableDate = now.isBefore(availableUntil) && now.isAfter(availableFrom);
                                                        const isAvailableAttempts = test.attempts_left > 0;
                                                        const availableTest = isAvailableDate && isAvailableAttempts;
                                                        const tooltipText = !isAvailableDate ? 'La fecha ha caducado' : !isAvailableAttempts ? 'No quedan intentos disponibles' : '';
                                                        const style = styleTypes.find((type) => type.id === test.id);
                                                        return (

                                                            <Tooltip label={tooltipText} hasArrow placement='top'>
                                                                <Stack key={`card-test-${index2}`}
                                                                    w={'100%'}
                                                                    minW={{ base: '100%', md: '300px' }}
                                                                    maxW={{ base: '90%', md: '500px' }}
                                                                    px={6}
                                                                    py={8}
                                                                    bgColor={availableTest ? bgColorCards : bgColorCardsDisabled}
                                                                    borderRadius={8}
                                                                    spacing={4}
                                                                    border={'1px solid'}
                                                                    borderColor={'gray.100'}
                                                                    boxShadow={'lg'}
                                                                    flexDir='row'
                                                                    justifyContent={'space-between'}
                                                                    alignItems='flex-start' _hover={{
                                                                        borderColor: 'primary.500',
                                                                        transition: 'all 0.3s ease-in-out'
                                                                    }}
                                                                    cursor={availableTest ? 'pointer' : 'not-allowed'}
                                                                >
                                                                    <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'} w='100%'>
                                                                        <Stack flexDir={'row'} w='100%' alignItems={'flex-start'} justifyContent={'space-between'}>
                                                                            <Stack flexDir='column' alignItems={'flex-start'} justifyContent={'flex-start'} w='100%'>
                                                                                <Stack flexDir='row' w='100%' alignItems={'center'} justifyContent={'space-between'} >
                                                                                    {
                                                                                        test.name && test.name.trim() != '' && (
                                                                                            <Text fontWeight={'semibold'} fontSize={{ base: '1rem', md: '1.4rem' }} color={colorDarkText} >{test.name}
                                                                                                <UniIcon onClick={() => speakText(test.name)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                                                                                            </Text>
                                                                                        )
                                                                                    }

                                                                                    <Text textAlign={'justify'} fontSize={'0.7rem'} color={style?.color} bgColor={style?.bgColor} py={1} px={2} borderRadius={8} border={'1px solid'} borderColor={style?.borderColor} >{dataTestTypes && dataTestTypes.length > 0 ? dataTestTypes.find((type) => type.id === test.type_id)?.name : test.type_id}</Text>
                                                                                </Stack>
                                                                                {
                                                                                    test.description && test.description.trim() != '' && (
                                                                                        <Text color={colorText} fontSize={'0.9rem'} fontWeight={'normal'} textAlign={'justify'}>{test.description}
                                                                                            <UniIcon onClick={() => speakText(test.description)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                                                                                        </Text>
                                                                                    )
                                                                                }

                                                                            </Stack>
                                                                        </Stack>

                                                                        <Button
                                                                            disabled={!availableTest}
                                                                            w={'100%'}
                                                                            mt={2}
                                                                            variant={"solid"}
                                                                            leftIcon={<UniIcon icon={'UilPlayCircle'} />
                                                                            } onClick={() => navigate(`/studenttest/${test.id}`)} >Comenzar test</Button>
                                                                    </Stack>

                                                                </Stack>
                                                            </Tooltip>
                                                        )
                                                    })
                                                )
                                            }
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