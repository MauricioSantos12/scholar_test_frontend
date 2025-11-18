import { Button, Heading, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react'
import React, { useRef } from 'react'
import UniIcon from '../utils/UniIcon'
import { useReactToPrint } from 'react-to-print';
import { speakText, stripHtmlTags } from '../utils/useSpeech.jsx';

const ResultsComponent = ({ completeTest, user, completeResults, dataRecommendations, showDownloadButton = true }) => {
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef,
        documentTitle: `Resultados de ${completeTest?.name || ''} - ${user?.name || ''} ${user?.last_name || ''}`,
    });

    const bgColors = [
        useColorModeValue('red.50', 'red.900'),
        useColorModeValue('cyan.50', 'cyan.900'),
        useColorModeValue('orange.50', 'orange.900'),
        useColorModeValue('green.50', 'green.900'),
        useColorModeValue('purple.50', 'purple.900'),
    ]

    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorColorMode = useColorModeValue('secondary.50', 'secondary.800');

    return (
        <Stack w='100%' gap={2} >
            {
                showDownloadButton && (
                    <>
                        <Stack flexDir={'row'} gap={0} w='100%' h='auto' justifyContent={'space-between'} alignItems={'center'}>
                            <Stack flexDir={'row'} gap={2} w='100%' justifyContent={'flex-start'} onClick={() => window.history.back()} cursor='pointer' _hover={{
                                "& svg": { color: 'primary.500' },
                                "& p": { color: 'primary.500' }
                            }}>
                                <UniIcon icon='UilArrowLeft' cursor={'pointer'} size={6} />
                                <Text>Regresar</Text>
                            </Stack>
                        </Stack>
                        <Stack w={'100%'} gap={2} flexDir='row' justifyContent={{ base: 'flex-start', md: 'flex-end' }}>
                            <Button
                                onClick={handlePrint}
                                colorScheme="teal"
                                variant="gray"
                                size={{ base: 'xs', md: 'md' }}
                            > Descargar resultados <UniIcon icon="UilDownloadAlt" size={6} ml={1} /></Button>
                        </Stack>
                    </>
                )
            }

            <Stack w='100%' ref={contentRef} p={4} maxW={'750px'} margin={'0 auto'} justifyContent={'center'} alignItems={'center'} >
                <Stack my={{ base: 1, md: 4 }} w={'100%'} gap={{ base: 2, md: 4 }}>
                    <Stack w='100%' justifyContent={'center'} alignItems={'center'}>
                        <UniIcon icon={'UilCheckCircle'} color='green.400' size={{ base: '4rem', md: '6rem' }} bgColor={'green.100'} borderRadius={'50%'} p={4} />
                    </Stack>
                    <Heading color={'dark_text'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '0.9rem', md: '1.5rem' }}>¡Test completado!
                        <UniIcon onClick={() => speakText(`¡Test completado!`)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                    </Heading>
                    <Text textAlign={'center'}>{`Has finalizado el test ${completeTest.name}`}
                        <UniIcon onClick={() => speakText(`Has finalizado el test ${completeTest.name}`)} cursor={'pointer'} icon={'UilVolume'} size={4} />
                    </Text>
                </Stack>

                <Stack w={'100%'} gap={2}>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'center'} dangerouslySetInnerHTML={{ __html: `¡Felicidades <b>${user?.name || ''}</b>, has completado el test! 🎉` }} />
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'justify'}>{`A continuación podrás ver un resumen de tus resultados generales, junto con el desempeño obtenido en cada área y en los diferentes componentes evaluados.`}</Text>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'justify'} >{`Estos resultados te permitirán identificar tus fortalezas y reconocer las áreas en las que puedes seguir mejorando.`}</Text>
                </Stack>
                <Text w='100%' fontWeight={'bold'} textAlign={'center'} color={'primary.500'} fontSize={{ base: '1.5rem', md: '3rem' }}>{completeResults?.totalScore}%</Text>
                <Text textAlign={'center'} >{`Preguntas acertadas ${completeResults?.totalCorrect} / ${completeResults?.totalQuestions}`}</Text>
                <Stack gap={4} w={'100%'}>
                    {
                        completeTest && completeTest.areas && completeTest.areas.length > 0 && completeResults && dataRecommendations && (
                            <TableContainer w={'100%'} bgColor={bgColorColorMode}>
                                <Table variant='simple' size={{ base: 'sm', md: 'md' }} border='2px solid #E2E8F0'>
                                    <Thead>
                                        <Tr bgColor={bgColorColorMode} borderBottom={'2px solid #E2E8F0'}>
                                            <Th textAlign={'center'} borderRight={'2px solid #E2E8F0'}>Área</Th>
                                            <Th textAlign={'center'} borderRight={'2px solid #E2E8F0'}>Puntaje</Th>
                                            <Th textAlign={'center'}>Observación</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {completeTest.areas.map((dt, i) => {
                                            const resultByArea = completeResults.resultsByArea[dt.id];
                                            const recommendationsByArea = dataRecommendations && dataRecommendations.length > 0 && dataRecommendations.filter(recommendation => recommendation.area_id === dt.id);
                                            let recommendation = '';
                                            if (recommendationsByArea) {
                                                recommendationsByArea.forEach(element => {
                                                    if (element.min_score && element.max_score) {
                                                        if (parseInt(resultByArea.score) >= parseInt(element.min_score) && parseInt(resultByArea.score) <= parseInt(element.max_score)) {
                                                            recommendation = element
                                                        }
                                                    }
                                                });
                                            }
                                            const randomColor = bgColors[i];
                                            return (
                                                <>
                                                    <Tr key={dt.id} bgColor={randomColor ? randomColor : '#F8FAFC'} borderBottom={'2px solid #E2E8F0'}>
                                                        <Td textAlign={'center'} borderRight={'2px solid #E2E8F0'}>{dt.name}</Td>
                                                        <Td textAlign={'center'} borderRight={'2px solid #E2E8F0'}>{resultByArea?.score}%</Td>
                                                        <td style={{ textWrap: 'balance', textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: recommendation ? recommendation.text : '' }} />
                                                        {recommendation.text &&
                                                            (
                                                                <UniIcon onClick={() => speakText(stripHtmlTags(recommendation.text))} cursor={'pointer'} icon={'UilVolume'} size={4} />

                                                            )}

                                                    </Tr>
                                                </>
                                            )
                                        })}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        )
                    }
                    {
                        completeTest && completeTest.areas.length > 0 && completeResults && (
                            completeTest.areas.map((area) => {
                                const areaName = area.name;
                                return (
                                    <TableContainer w={'100%'}>
                                        <Table variant='simple' size={{ base: 'sm', md: 'md' }} border='2px solid #E2E8F0'>
                                            <Thead>
                                                <Tr borderBottom={'2px solid #E2E8F0'}>
                                                    <Th textAlign={'center'} borderRight={'2px solid #E2E8F0'}>Area</Th>
                                                    <Th textAlign={'center'} borderRight={'2px solid #E2E8F0'}>Componente</Th>
                                                    <Th textAlign={'center'}>Valor</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {area.components.map((component, i) => {
                                                    const componentName = component?.name;
                                                    const componentValue = completeResults?.resultsByComponent[component?.id]?.score;
                                                    const randomColor = bgColors[i];
                                                    return (
                                                        <Tr key={component.id} bgColor={randomColor ? randomColor : '#F8FAFC'} borderBottom={'2px solid #E2E8F0'}>
                                                            {
                                                                i === 0 && (
                                                                    <Td bgColor={bgColorColorMode} rowSpan={area.components.length} textAlign={'center'} borderRight={'2px solid #E2E8F0'}>{areaName}</Td>
                                                                )
                                                            }
                                                            <Td textAlign={'center'} borderRight={'2px solid #E2E8F0'}>{componentName}</Td>
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
                </Stack>

            </Stack>
        </Stack>
    )
}

export default ResultsComponent