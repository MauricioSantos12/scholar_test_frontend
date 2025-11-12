import { Button, Divider, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import UniIcon from '../../utils/UniIcon';
import UseFetch from '../../utils/UseFetch';
import Loading from '../Loading';

const ResultView = ({ completeTest, setStep, setQuestionStep, setAreaStep, setComponentStep, setAnswersByUser, answersByUser }) => {
  const { data, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
  const { data: dataRecommendations, loading: loadingRecommendations, error: errorRecommendations, fetchData: fetchRecommendations } = UseFetch()
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests({
      url: '/results',
      method: 'POST',
      body: {
        test_id: completeTest.id,
        user_id: user.id,
        answers: answersByUser
      }
    });
    fetchRecommendations({
      url: '/recommendations',
      method: 'GET',
    })
  }, [])

  const handleFinishTest = () => {
    setStep('principalView');
    setAreaStep(0);
    setComponentStep(0);
    setQuestionStep(0);
    setAnswersByUser([]);
    navigate('/studenttests');
  }

  if (errorTests || errorRecommendations) return <Text color={'red.500'}>Error: {errorTests || errorRecommendations}</Text>;
  if (loadingTests || loadingRecommendations || !completeTest) return <Loading />
  return (
    <Stack w='100%' gap={4} >
      <Stack my={4} w={'100%'} gap={4}>
        <Stack w='100%' justifyContent={'center'} alignItems={'center'}>
          <UniIcon icon={'UilCheckCircle'} color='green.400' size={{ base: '3rem', md: '6rem' }} bgColor={'green.100'} borderRadius={'50%'} p={4} />
        </Stack>
        <Heading color={'dark_text'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '1.2rem', md: '2rem' }}>¡Test completado!</Heading>
        <Text textAlign={'center'}>{`Has finalizado el test ${completeTest.name}`}</Text>
      </Stack>
      <Stack w={'100%'} gap={2}>
      </Stack>
      <Stack w={'100%'} gap={2}>
        <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }} textAlign={'center'} dangerouslySetInnerHTML={{ __html: `¡Felicidades <b>${user.name}</b>, has completado el test! 🎉` }} />
        <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>{`A continuación podrás ver un resumen de tus resultados generales, junto con el desempeño obtenido en cada área y en los diferentes componentes evaluados.`}</Text>
        <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>{`Estos resultados te permitirán identificar tus fortalezas y reconocer las áreas en las que puedes seguir mejorando.`}</Text>
      </Stack>
      <Text w='100%' fontWeight={'bold'} textAlign={'center'} color={'primary.500'} fontSize={{ base: '1.5rem', md: '3rem' }}>{data?.totalScore}%</Text>
      <Text textAlign={'center'} fontSize={'lg'}>{`Preguntas acertadas ${data?.totalCorrect} / ${data?.totalQuestions}`}</Text>
      <Divider mt={8} />
      <Text color={'dark_text'} fontSize={'lg'} fontWeight={'bold'}>Resultados por áreas</Text>
      {
        completeTest && completeTest.areas && completeTest.areas.length > 0 && data && dataRecommendations && (
          <TableContainer w={'100%'}>
            <Table variant='simple' size={'lg'}>
              <Thead>
                <Tr>
                  <Th textAlign={'center'}>Área</Th>
                  <Th textAlign={'center'}>Observación</Th>
                </Tr>
              </Thead>
              <Tbody>
                {completeTest.areas.map((dt, i) => {
                  const resultByArea = data.resultsByArea[dt.id];
                  const recommendationsByArea = dataRecommendations && dataRecommendations.length > 0 && dataRecommendations.filter(recommendation => recommendation.area_id === dt.id);
                  let recommendation = '';
                  if (recommendationsByArea) {
                    recommendationsByArea.forEach(element => {
                      if (element.min_score && element.max_score && resultByArea.score) {
                        if (parseInt(resultByArea.score) >= parseInt(element.min_score) && parseInt(resultByArea.score) <= parseInt(element.max_score)) {
                          recommendation = element
                        }
                      }
                    });
                  }
                  return (
                    <Tr key={dt.id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                      <Td textAlign={'center'}>{dt.name}</Td>
                      <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: recommendation ? recommendation.text : '' }} />
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )
      }
      <Text color={'dark_text'} fontSize={'lg'} fontWeight={'bold'}>Resultados por componentes</Text>
      {
        completeTest && completeTest.areas.length > 0 && data && (
          completeTest.areas.map((area) => {
            const areaName = area.name;
            return (
              <TableContainer w={'100%'}>
                <Table variant='simple' size={'lg'}>
                  <Thead>
                    <Tr>
                      <Th textAlign={'center'}>Area</Th>
                      <Th textAlign={'center'}>Componente</Th>
                      <Th textAlign={'center'}>Valor</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {area.components.map((component, i) => {
                      const componentName = component.name;
                      const componentValue = data.resultsByComponent[component.id].score;
                      return (
                        <Tr key={component.id} bgColor={i % 2 === 0 ? '#F8FAFC' : 'white'}>
                          {
                            i === 0 && (
                              <Td rowSpan={area.components.length} textAlign={'center'}>{areaName}</Td>
                            )
                          }
                          <Td textAlign={'center'}>{componentName}</Td>
                          <Td textAlign={'center'}>{`${componentValue}%`}</Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            )
          })
        )


      }

      <Button w={'100%'} variant={'solid'} onClick={() => { handleFinishTest() }} leftIcon={<UniIcon icon={'UilArrowCircleLeft'} />} >Regresar</Button>
    </Stack>
  )
}

export default ResultView