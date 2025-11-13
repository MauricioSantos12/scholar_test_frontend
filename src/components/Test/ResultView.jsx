import { Button, Divider, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import UniIcon from '../../utils/UniIcon';
import UseFetch from '../../utils/UseFetch';
import Loading from '../Loading';
import { useReactToPrint } from 'react-to-print';
import ResultsComponent from '../ResultsComponent';

const ResultView = ({ completeTest, setStep, setQuestionStep, setAreaStep, setComponentStep, setAnswersByUser, answersByUser, testResult, intervalId,
  setIntervalId }) => {
  const { data, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
  const { data: dataRecommendations, loading: loadingRecommendations, error: errorRecommendations, fetchData: fetchRecommendations } = UseFetch()
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const finishedResult = await fetchTests({
        url: `/tests/${completeTest.id}/result/${testResult.id}/finish`,
        method: 'POST',
      })
      if (finishedResult) {
        fetchTests({
          url: '/results',
          method: 'POST',
          body: {
            test_id: completeTest.id,
            user_id: user.id,
            answers: answersByUser,
            test_result_id: testResult.id
          }
        });

        await fetchRecommendations({
          url: '/recommendations',
          method: 'GET',
        })
      }
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }

    }
    fetchData();
  }, [])

  const handleFinishTest = () => {
    setStep('principalView');
    setAreaStep(0);
    setComponentStep(0);
    setQuestionStep(0);
    setAnswersByUser([]);
    navigate('/studenttests');
  }

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Resultados de ${completeTest.name} - ${user.name} ${user.last_name}`,
  });

  if (errorTests || errorRecommendations) return <Text color={'red.500'}>Error: {errorTests || errorRecommendations}</Text>;
  if (loadingTests || loadingRecommendations || !completeTest) return <Loading />
  return (
    <Stack w='100%' gap={{ base: 2, md: 4 }}>
      <Stack w={'100%'} gap={2} flexDir='row' justifyContent={{ base: 'flex-start', md: 'flex-end' }}>
        <Button
          onClick={handlePrint}
          colorScheme="teal"
          variant="gray"
          size={{ base: 'xs', md: 'md' }}
        > Descargar resultados <UniIcon icon="UilDownloadAlt" size={6} ml={1} /></Button>
      </Stack>
      <Stack w='100%' ref={contentRef} p={{ base: 4, md: 8 }} maxW={'750px'} margin={'0 auto'} justifyContent={'center'} alignItems={'center'} >
        <ResultsComponent completeTest={completeTest} user={user} completeResults={data} dataRecommendations={dataRecommendations} showDownloadButton={false} />

      </Stack>
      <Button w={'100%'} variant={'solid'} mt={{ base: 3, md: 5 }} onClick={() => { handleFinishTest() }} leftIcon={<UniIcon icon={'UilArrowCircleLeft'} />} >Regresar</Button>
    </Stack>
  )
}

export default ResultView