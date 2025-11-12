import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, Heading, Image, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react';
import UniIcon from '../../utils/UniIcon.jsx'
import VideoModal from '../Modal/VideoModal.jsx';
import RenderVideo from '../RenderVideo.jsx';
const QuestionView = ({ completeTest, setStep, areaStep, questionStep, setQuestionStep, setAreaStep, setComponentStep, setAnswersByUser, typeTest, setCurrentQuestion, currentQuestion }) => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [videoSelected, setVideoSelected] = useState(null);
    const [sentAnswer, setSentAnswer] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure()
    const areas = completeTest.areas[areaStep];
    const question = areas.questionsByArea[questionStep];
    console.log({ question })
    const handleNext = () => {
        if (!sentAnswer && typeTest?.id == 2 && selectedAnswer?.explanation) {
            setSentAnswer(true);
            return;
        } else {
            setAnswersByUser(prevAnswers => [...prevAnswers, { question_id: question.id, answer_id: selectedAnswer?.id }]);
            if (questionStep == areas.questionsByArea.length - 1) {
                if (areaStep == completeTest.areas.length - 1) {
                    setCurrentQuestion(currentQuestion + 1);
                    setStep('resultView');
                } else {
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

    }

    const nextButtonText = questionStep == areas.questionsByArea.length - 1 && areaStep == completeTest.areas.length - 1 ? 'Finalizar prueba ' :
        questionStep == areas.questionsByArea.length - 1 ? 'Finalizar área ' :
            'Siguiente';

    return (
        <Stack w='100%' gap={4} >
            <Breadcrumb spacing='8px' separator={<UniIcon size={5} icon='UilAngleRightB' color='gray.500' />}>
                <BreadcrumbItem><BreadcrumbLink>{completeTest?.name} </BreadcrumbLink> </BreadcrumbItem>
                <BreadcrumbItem><BreadcrumbLink>{areas?.name} </BreadcrumbLink> </BreadcrumbItem>
            </Breadcrumb>
            <Stack my={4} w={'100%'} gap={2}>
                <Heading color={'dark_text'} textAlign={'left'} fontWeight={'bold'} fontSize={{ base: '1rem', md: '1.5rem' }}>{`Pregunta ${questionStep + 1}`}</Heading>
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }} dangerouslySetInnerHTML={{ __html: question?.first_text }} />
                {
                    question?.image_url && (
                        <Image objectFit={'contain'} src={question?.image_url} alt={`Imagen de la pregunta ${questionStep + 1}`} w={{ base: '100%', md: '70%' }} margin={'0 auto'} h={'auto'} minH={'300px'} />
                    )
                }
                {
                    question?.video_url && (
                        <RenderVideo videoUrl={question?.video_url} />
                    )
                }
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }} dangerouslySetInnerHTML={{ __html: question?.second_text }} />
            </Stack>
            <Stack w={'100%'} gap={4} flexDir={'row'} flexWrap={'wrap'} justify={'space-between'} alignItems={'center'}>
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
                                        borderColor={selectedAnswer?.id === answer.id ? 'primary.600' : 'secondary.200'}
                                        borderRadius={8}
                                        bgColor={selectedAnswer?.id === answer.id ? 'primary.50' : 'secondary.50'}
                                        onClick={() => sentAnswer ? null : setSelectedAnswer(answer)}
                                    >
                                        <Text m={0} p={0}
                                            dangerouslySetInnerHTML={{ __html: answer.text }}
                                        />
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
                                                    color={'primary.600'}
                                                    cursor={'pointer'}
                                                    _hover={{
                                                        bg: 'primary.600',
                                                        color: 'white',
                                                        transition: 'all 0.4s ease-in-out'
                                                    }}
                                                ><UniIcon icon='UilEye' mr={2} /></Text>
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
                        <Divider />
                        <Text fontSize={'xl'} fontWeight={'bold'} color={'text'}>Retroalimentación</Text>
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
            <Button w={'100%'} disabled={!selectedAnswer} variant={'solid'} onClick={() => { handleNext() }}>{nextButtonText}</Button>
            {
                videoSelected && (
                    <VideoModal isOpen={isOpen} onClose={onClose} videoUrl={videoSelected} />
                )
            }
        </Stack>
    )
}

export default QuestionView