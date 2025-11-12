import { Container, Progress, Stack, Text, useDisclosure } from '@chakra-ui/react';
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
        setCurrentQuestion
    }
    const views = {
        principalView: (props) => <InitialView {...props} />,
        areaView: (props) => <AreaView {...props} />,
        questionView: (props) => <QuestionView {...props} />,
        resultView: (props) => <ResultView {...props} />,
    };

    const RenderView = useMemo(() => {
        const ViewComponent = views[step];
        return <ViewComponent {...props} />;
    }, [step, completeTest, dataTestTypes, questionStep, areaStep]);

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
    const style = styleTypes.find((type) => type.id === typeTest?.id);

    if (loadingTests || !completeTest || loadingTestTypes) return <Loading />;
    if (errorTests || errorTestTypes) return <Text color={'red.500'}>Error: {errorTests || errorTestTypes}</Text>;
    return (
        <Stack direction={'row'} flexWrap={'wrap'} gap={0} p={0} m={0} h="auto" w='100%' alignItems={'flex-start'} justifyContent={'center'} >
            <Container maxW={{ base: '90%', md: '800px' }} margin={'0 auto'} w='100%' h='auto' p={8} gap={4} display={'flex'} flexDir={'column'} justifyContent={'center'} alignItems={'center'} bg='white' boxShadow={'lg'} borderRadius={8} m={8}>

                <Stack flexDir={'row'} gap={0} w='100%' h='auto' justifyContent={'space-between'} alignItems={'center'}>
                    <Stack flexDir={'row'} gap={2} w='100%' justifyContent={'flex-start'} onClick={() => window.history.back()} cursor='pointer' _hover={{
                        "& svg": { color: 'primary.500' },
                        "& p": { color: 'primary.500' }
                    }}>
                        <UniIcon icon='UilArrowLeft' cursor={'pointer'} size={6} />
                        <Text>Regresar</Text>
                    </Stack>
                    <Stack flexDir={'row'} gap={2} w='100%' justifyContent={'flex-end'}>
                        <Text color={style?.color} bgColor={style?.bgColor} py={1} px={2} borderRadius={8} border={'1px solid'} borderColor={style?.borderColor} >{typeTest?.name || ''}</Text>
                    </Stack>
                </Stack>
                {
                    startTime && (
                        <Stack gap={1} w='100%' justifyContent={'flex-start'} justifyItems={'flex-start'} h={'auto'}>
                            <Stack flexDir={'row'} gap={0} w='100%' h='auto' justifyContent={'space-between'} alignItems={'center'}>
                                <Text>Pregunta {currentQuestion + 1} de {totalQuestions.length}</Text>
                                <Text >Tiempo restante: {formatTime(remainingTime)}</Text>
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
                <Stack flexDir={'row'} gap={2} w='100%' justifyContent={'flex-end'}>
                </Stack>
                {RenderView}
            </Container>
            <FinishTimeModal isOpen={isOpen} onClose={onClose} onClick={goToResultView} />
        </Stack>
    )
}

export default StudentTest