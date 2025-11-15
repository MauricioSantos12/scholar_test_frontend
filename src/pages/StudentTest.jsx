import { Container, Heading, Progress, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import AreaView from '../components/Test/AreaView';
import ComponentView from '../components/Test/ComponentView';
import InitialView from '../components/Test/InitialView';
import QuestionView from '../components/Test/QuestionView';
import ResultView from '../components/Test/ResultView';
import UniIcon from '../utils/UniIcon';
import UseFetch from '../utils/UseFetch';
import { styleTypes } from '../utils/constants';
import { useAuth } from '../context/useAuth';
import FinishTimeModal from '../components/Modal/FinishTimeModal';

const StudentTest = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [completeTest, setCompletTest] = useState([]);
    const { loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataTestTypes, loading: loadingTestTypes, error: errorTestTypes, fetchData: fetchTestTypes } = UseFetch()
    const [step, setStep] = useState('principalView');
    const [areaStep, setAreaStep] = useState(0);
    const [componentStep, setComponentStep] = useState(0);
    const [questionStep, setQuestionStep] = useState(0);
    const [answersByUser, setAnswersByUser] = useState([]);
    const [testResult, setTestResult] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [intervalId, setIntervalId] = useState(null);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (startTime && maxTime) {
            if (intervalId) clearInterval(intervalId);

            const endTime = new Date(startTime).getTime() + maxTime * 60 * 1000 + 1000;

            const id = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
                setRemainingTime(remaining);

                if (remaining <= 0) {
                    clearInterval(id);
                    handleTimeUp();
                }
            }, 1000);

            setIntervalId(id);

            return () => clearInterval(id);
        }
    }, [startTime, maxTime, completeTest]);

    useEffect(() => {
        fetchTests({
            url: '/tests',
            method: 'GET',
        });
        fetchTestTypes({
            url: '/testtypes',
            method: 'GET',
        })
        getFullTest();

    }, [fetchTests]);
    const handleTimeUp = async () => {
        const _answerByUserIncompleted = [...answersByUser];
        totalQuestions.forEach((question) => {
            const questionId = question.id;
            const hasAnswer = _answerByUserIncompleted.find(answer => answer.question_id == questionId);
            if (!hasAnswer) {
                _answerByUserIncompleted.push({ question_id: questionId, answer_id: null });
            }
        })
        setAnswersByUser(_answerByUserIncompleted);
        onOpen();
    };

    const goToResultView = () => {
        setStep('resultView');

    }

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };


    const typeTest = completeTest && completeTest.testType && completeTest.testType.length > 0 && dataTestTypes && dataTestTypes.length > 0 && dataTestTypes.find(type => type.id == parseInt(completeTest.testType[0].id))

    const views = {
        principalView: (props) => <InitialView {...props} />,
        areaView: (props) => <AreaView {...props} />,
        questionView: (props) => <QuestionView {...props} />,
        resultView: (props) => <ResultView {...props} />,
    };



    const getFullTest = async () => {
        const _completeTest = await fetchTests({
            url: `/tests/${id}/full`,
            method: 'GET',
        })
        if (_completeTest) {
            let _totalQuestions = [];
            _completeTest.areas.forEach((area) => {
                if (area?.questionsByArea) {
                    _totalQuestions = [...area.questionsByArea, ..._totalQuestions]

                }
            })
            setCompletTest(_completeTest);
            setMaxTime(_completeTest?.max_time_minutes);
            setRemainingTime(_completeTest?.max_time_minutes * 60);
            setTotalQuestions(_totalQuestions);
        }
    }

    const style = styleTypes.find((type) => type.id === typeTest?.id);

    const props = {
        completeTest,
        setStep,
        step,
        areaStep,
        setAreaStep,
        componentStep,
        setComponentStep,
        questionStep,
        setQuestionStep,
        setAnswersByUser,
        answersByUser,
        typeTest,
        user,
        fetchTests,
        testResult,
        setTestResult,
        remainingTime,
        setRemainingTime,
        maxTime,
        setMaxTime,
        startTime,
        setStartTime,
        intervalId,
        setIntervalId,
        totalQuestions,
        currentQuestion,
        setCurrentQuestion,
        style,
        formatTime,
    }

    const RenderView = useMemo(() => {
        const ViewComponent = views[step];
        return <ViewComponent {...props} />;
    }, [step, completeTest, dataTestTypes, questionStep, areaStep]);

    if (loadingTests || !completeTest || loadingTestTypes) return <Loading />;
    if (errorTests || errorTestTypes) return <Text color={'red.500'}>Error: {errorTests || errorTestTypes}</Text>;
    if (!typeTest) return <Loading />;
    const areas = completeTest.areas[areaStep];
    return (
        <Stack direction={'row'} flexWrap={'wrap'} gap={0} p={0} m={0} h="auto" w='100%' alignItems={'flex-start'} justifyContent={'center'} >
            {
                step == 'questionView' && (
                    <>
                        <Stack bg='white' w='100%' p={2} gap={1} alignItems={'center'} justifyContent={'center'} >
                            <Heading as={'h2'} color={'dark_text'} textAlign={'center'} fontSize={{ base: 'lg', md: '2xl' }}>{completeTest?.name}</Heading>
                            <Text fontSize={'0.5rem'}>Pregunta {currentQuestion + 1} de {totalQuestions.length}</Text>
                            <Stack flexDir={{ base: 'column', md: 'row' }} gap={2} w='100%' h='auto' justifyContent={'space-between'} alignItems={'center'}>
                                <Text fontSize={{ base: 'sm', md: 'md' }} textAlign={'center'}>{areas?.name}</Text>
                                {
                                    startTime && (
                                        <Stack gap={2} w='100%' justifyContent={'flex-start'} justifyItems={'flex-start'} h={'auto'}>
                                            <Stack flexDir={'row'} gap={0} w='100%' h='auto' justifyContent={'space-between'} alignItems={'center'}>
                                            </Stack>
                                            <Progress
                                                value={currentQuestion}
                                                max={totalQuestions.length - 1}
                                                min={0}
                                                w='100%'
                                                borderRadius={8}
                                                size={'md'}
                                                isAnimated />
                                        </Stack>
                                    )
                                }
                                <Text fontWeight={'bold'} display={'flex'} alignItems={'center'} flex={'row'} gap={1}>{formatTime(remainingTime)} <UniIcon icon='UilClock' size={4} color='primary.700' /></Text>

                            </Stack>
                        </Stack>
                        <Progress w={'100%'} value={100} size={'xs'} color={'primary.500'} />
                    </>

                )
            }
            {RenderView}
            <FinishTimeModal isOpen={isOpen} onClose={onClose} onClick={goToResultView} />
        </Stack>
    )
}

export default StudentTest