import { Button, Container, Divider, Grid, GridItem, Heading, Image, Progress, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import UniIcon from '../../utils/UniIcon.jsx'
import VideoModal from '../Modal/VideoModal.jsx';
import RenderVideo from '../RenderVideo.jsx';
import { speakText, stripHtmlTags } from '../../utils/useSpeech.jsx';
const QuestionView = ({ completeTest, setStep, areaStep, questionStep, setQuestionStep, setAreaStep, setComponentStep, setAnswersByUser, typeTest, setCurrentQuestion, currentQuestion, }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [videoSelected, setVideoSelected] = useState(null);
    const [sentAnswer, setSentAnswer] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const areas = completeTest.areas[areaStep];
    const question = areas.questionsByArea[questionStep];


    const handleNext = () => {
        if (!sentAnswer && typeTest?.id == 2 && selectedAnswer?.explanation) {
            setSentAnswer(true);
            return;
        } else {
            setAnswersByUser(prevAnswers => [...prevAnswers, { question_id: question.id, answer_id: selectedAnswer?.id }]);
            if (questionStep == areas.questionsByArea.length - 1) {
                if (areaStep == completeTest.areas.length - 1) {
                    // setCurrentQuestion(currentQuestion + 1);
                    setStep('resultView');
                } else {
                    setCurrentQuestion(currentQuestion + 1);
                    setStep('areaView');
                    setAreaStep(areaStep + 1);
                    setComponentStep(0);
                    setQuestionStep(0);
                }
            } else {
                setQuestionStep(questionStep + 1);
                setCurrentQuestion(currentQuestion + 1);
            }
            setSelectedAnswer(null);
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    const nextButtonText = questionStep == areas.questionsByArea.length - 1 && areaStep == completeTest.areas.length - 1 ? 'Finalizar prueba ' :
        questionStep == areas.questionsByArea.length - 1 ? 'Finalizar área ' :
            'Siguiente';

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorColorMode = useColorModeValue('white', 'secondary.800');
    const bgColorAnswersColorMode = useColorModeValue('gray.100', 'secondary.900');
    const bgColorSelectedAnswerColorMode = useColorModeValue('primary.50', 'secondary.900');
    const bgColorUnselectedAnswerColorMode = useColorModeValue('white', 'secondary.800');
    const colorTextSelectedAnswerColorMode = useColorModeValue('text', 'secondary.100');
    const colorTextUnselectedAnswerColorMode = useColorModeValue('text', 'secondary.200');
    const borderColorSelectedAnswerColorMode = useColorModeValue('primary.600', 'secondary.600');
    const borderColorUnselectedAnswerColorMode = useColorModeValue('white', 'secondary.600');

    return (
        <Stack w='100%' gap={0} h='100%' justifyContent={'flex-start'} alignItems={'center'}>
            <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} gap={0} h='100%' w='100%'>
                <GridItem bgColor={bgColorColorMode} h='100%' >
                    <Container overflowY={'auto'} maxH={{ base: 'auto', md: '550px', lg: '750px' }} maxW={'container.xl'} margin={'0 auto'} w='100%' h='100%' gap={4} display={'flex'} flexDir={'column'} justifyContent={'flex-start'} alignItems={'center'}>
                        <Stack my={8} w={'100%'} gap={2}>
                            <Heading color={colorDarkText} textAlign={'left'} fontWeight={'bold'} fontSize={{ base: '1rem', md: '1.5rem' }}>{`Pregunta ${questionStep + 1}`}
                                <UniIcon onClick={() => speakText(`Pregunta ${questionStep + 1}`)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                            </Heading>
                            {
                                question?.first_text && question.first_text.trim() != '' && (
                                    <Stack flexDir={'row'} flexWrap={'wrap'} justify={'flex-start'} alignItems={'center'}>
                                        <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} py={2} dangerouslySetInnerHTML={{ __html: question?.first_text }} />
                                        <UniIcon onClick={() => speakText(stripHtmlTags(question?.first_text))} cursor={'pointer'} icon={'UilVolume'} size={4} />
                                    </Stack>
                                )
                            }

                            {
                                question?.image_url && (
                                    <Image loading='lazy' objectFit={'contain'} src={question?.image_url} alt={`Imagen de la pregunta ${questionStep + 1}`} w={{ base: '100%', md: '70%' }} margin={'0 auto'} h={'auto'} minH={'300px'} minW={'300px'} />
                                )
                            }
                            {
                                question?.video_url && typeTest?.id == 3 && (
                                    <RenderVideo videoUrl={question?.video_url} />
                                )
                            }
                            {
                                question.second_text && question.second_text.trim() != '' && (
                                    <Stack flexDir={'row'} flexWrap={'wrap'} justify={'flex-start'} alignItems={'center'}>
                                        <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} py={2} dangerouslySetInnerHTML={{ __html: question?.second_text }} />
                                        <UniIcon onClick={() => speakText(stripHtmlTags(question?.second_text))} cursor={'pointer'} icon={'UilVolume'} size={4} />
                                    </Stack>
                                )
                            }




                        </Stack>
                    </Container>
                </GridItem>
                <GridItem bgColor={bgColorAnswersColorMode} overflowY={'auto'} h='auto' >
                    <Container maxW={'container.xl'} margin={'0 auto'} w='100%' h='100%' gap={4} display={'flex'} flexDir={'column'} justifyContent={'flex-start'} alignItems={'center'}>
                        <Stack my={8} w={'100%'} gap={2}>
                            <Stack w={'100%'} gap={2} flexDir={'row'} flexWrap={'wrap'} justify={'space-between'} alignItems={'center'}>
                                {
                                    question.answers && question.answers.length > 0 && (
                                        question.answers
                                            .map((answer) => {
                                                const videoUrl = answer.video_url;
                                                return (
                                                    <Stack
                                                        zIndex={1}
                                                        cursor={sentAnswer ? 'initial' : 'pointer'}
                                                        variant={selectedAnswer?.id === answer.id ? 'selectedAnswer' : 'outline'}
                                                        w='100%'
                                                        justifyContent={'space-between'}
                                                        p={5}
                                                        fontWeight={selectedAnswer?.id === answer.id ? 'bold' : 'normal'}
                                                        flexDir={'row'}
                                                        border={'1px solid'}
                                                        borderColor={selectedAnswer?.id === answer.id ? borderColorSelectedAnswerColorMode : borderColorUnselectedAnswerColorMode}
                                                        borderRadius={8}
                                                        bgColor={selectedAnswer?.id === answer.id ? bgColorSelectedAnswerColorMode : bgColorUnselectedAnswerColorMode}
                                                        onClick={() => sentAnswer ? null : setSelectedAnswer(answer)}
                                                        color={selectedAnswer?.id === answer.id ? colorTextSelectedAnswerColorMode : colorTextUnselectedAnswerColorMode}
                                                    >

                                                        <Stack flexDir={'row'} flexWrap={'wrap'} justify={'flex-start'} alignItems={'center'}>
                                                            <Text m={0} p={0}
                                                                dangerouslySetInnerHTML={{ __html: answer.text }}
                                                            />
                                                            <UniIcon onClick={() => speakText(stripHtmlTags(answer.text))} cursor={'pointer'} icon={'UilVolume'} size={4} />
                                                        </Stack>

                                                        {
                                                            videoUrl && typeTest && typeTest?.id == 3 && (
                                                                <Text
                                                                    onClick={() => { setVideoSelected(videoUrl); onOpen(); setSelectedAnswer(null) }}
                                                                    zIndex={2}
                                                                    display={'flex'}
                                                                    alignItems={'center'}
                                                                    justifyContent={'center'}
                                                                    border={'1px solid'}
                                                                    borderColor={'primary.600'}
                                                                    borderRadius={8}
                                                                    p={2}
                                                                    h={'fit-content'}
                                                                    color={'primary.600'}
                                                                    cursor={'pointer'}
                                                                    _hover={{
                                                                        bg: 'primary.600',
                                                                        color: 'white',
                                                                        transition: 'all 0.4s ease-in-out'
                                                                    }}
                                                                ><UniIcon icon='UilEye' /></Text>
                                                            )
                                                        }
                                                    </Stack>
                                                )
                                            })
                                    )
                                }
                            </Stack>
                            {
                                sentAnswer && selectedAnswer?.explanation && (
                                    <Stack mt={4}>
                                        <Text fontSize={'xl'} fontWeight={'bold'} color={colorText}>Retroalimentación</Text>
                                        <Stack
                                            variant={selectedAnswer?.is_correct === 1 ? 'selectedAnswer' : 'outline'}
                                            w='100%'
                                            justifyContent={'flex-start'}
                                            alignItems={'center'}
                                            p={5}
                                            fontWeight={selectedAnswer?.is_correct === 1 ? 'normal' : 'normal'}
                                            flexDir={'row'}
                                            border={'1px solid'}
                                            borderColor={selectedAnswer?.is_correct === 1 ? 'green.600' : 'red.200'}
                                            borderRadius={8}
                                            bgColor={selectedAnswer?.is_correct === 1 ? 'green.50' : 'red.50'}
                                        >
                                            <UniIcon
                                                icon={selectedAnswer?.is_correct === 1 ? 'UilCheckCircle' : 'UilTimesCircle'}
                                                color={selectedAnswer?.is_correct === 1 ? 'green.600' : 'red.600'}
                                                mr={2}
                                                size={8}
                                            />
                                            <Text display={'flex'}
                                                alignItems={'center'}
                                                justifyContent={'center'} m={0} p={0} dangerouslySetInnerHTML={{ __html: selectedAnswer?.explanation }} />
                                        </Stack>
                                    </Stack>
                                )
                            }
                            <Button w={'100%'} disabled={!selectedAnswer} mt={2} variant={'solid'} onClick={() => { handleNext() }}>{nextButtonText}</Button>
                            {
                                videoSelected && (
                                    <VideoModal isOpen={isOpen} onClose={onClose} videoUrl={videoSelected} />
                                )
                            }
                        </Stack>
                    </Container>
                </GridItem>
            </Grid>
        </Stack>
    )
}

export default QuestionView