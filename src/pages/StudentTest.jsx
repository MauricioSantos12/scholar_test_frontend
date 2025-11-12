import { Container, Stack, Text } from '@chakra-ui/react';
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

const StudentTest = () => {
    const { id } = useParams();
    const [completeTest, setCompletTest] = useState([]);
    const { loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataTestTypes, loading: loadingTestTypes, error: errorTestTypes, fetchData: fetchTestTypes } = UseFetch()
    const [step, setStep] = useState('principalView');
    const [areaStep, setAreaStep] = useState(0);
    const [componentStep, setComponentStep] = useState(0);
    const [questionStep, setQuestionStep] = useState(0);
    const [answersByUser, setAnswersByUser] = useState([]);
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
        typeTest
    }
    const views = {
        principalView: <InitialView {...props} />,
        areaView: <AreaView {...props} />,
        questionView: <QuestionView {...props} />,
        resultView: <ResultView   {...props} />,
    }

    const RenderView = () => {
        const view = useMemo(() => views[step], [step]);
        return view;
    }

    const getFullTest = async () => {
        const _completeTest = await fetchTests({
            url: `/tests/${id}/full`,
            method: 'GET',
        })
        setCompletTest(_completeTest);
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
                {<RenderView />}
            </Container>
        </Stack>
    )
}

export default StudentTest