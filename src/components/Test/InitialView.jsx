import { Button, Container, Heading, ListItem, Stack, Text, UnorderedList, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import UniIcon from '../../utils/UniIcon';

const InitialView = ({ completeTest, setStep, fetchTests, user, setTestResult, setStartTime, startTime, currentQuestion, totalQuestions, remainingTime, formatTime, typeTest, style, maxTime }) => {
    const handleStart = async () => {
        setStep('areaView');
        const result = await fetchTests({
            url: `/tests/${completeTest.id}/start`,
            method: 'POST',
            body: {
                userId: user.id
            }
        })
        if (result) {
            setTestResult(result);
            setStartTime(new Date(result?.start_time));
        }
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorColorMode = useColorModeValue('white', 'secondary.800');

    return (
        <Container maxW={{ base: '90%', md: '800px' }} margin={'0 auto'} w='100%' h='auto' p={8} gap={4} display={'flex'} flexDir={'column'} justifyContent={'center'} alignItems={'center'} bg={bgColorColorMode} boxShadow={'lg'} borderRadius={8} m={8}>
            <Stack flexDir={'row'} gap={0} w='100%' h='auto' justifyContent={'space-between'} alignItems={'center'}>
                <Stack flexDir={'row'} gap={2} w='100%' justifyContent={'flex-start'} onClick={() => window.history.back()} cursor='pointer' _hover={{
                    "& svg": { color: 'primary.500' },
                    "& p": { color: 'primary.500' }
                }}>
                    <UniIcon icon='UilArrowLeft' cursor={'pointer'} size={6} color={colorDarkText} />
                    <Text color={colorDarkText}>Regresar</Text>
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
            <Stack w='100%' gap={4} >
                <Stack my={4} w={'100%'} gap={2}>
                    <Heading color={colorDarkText} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '0.9rem', md: '1.5rem' }}>{`Bienvenido a la prueba ${completeTest.name}`}</Heading>
                </Stack>
                <Stack w={'100%'} gap={2}>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} fontWeight={'bold'} textAlign={'center'}>  ¡Bienvenido(a)! </Text>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'justify'}>El examen de Estado Saber 11° es una evaluación estandarizada que aplica el ICFES con el propósito de medir las competencias desarrolladas por los estudiantes al finalizar la educación media. Estas competencias reflejan la capacidad de usar los conocimientos adquiridos en distintas áreas para comprender, analizar y resolver situaciones del entorno académico y cotidiano.</Text>
                </Stack>
                <Stack w={'100%'} gap={2}>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'justify'}>El examen se compone de cinco pruebas:</Text>
                    <UnorderedList sx={{
                        '& > li ': {
                            color: colorText,
                            fontSize: { base: '1rem', md: '0.9rem' }
                        }
                    }}>
                        <ListItem >Matemáticas</ListItem>
                        <ListItem >Lectura Crítica</ListItem>
                        <ListItem >Sociales y Ciudadanas </ListItem>
                        <ListItem >Ciencias Naturales </ListItem>
                        <ListItem >Inglés  </ListItem>
                    </UnorderedList>
                </Stack>
                <Stack w={'100%'} gap={2}>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'justify'}>Cada prueba está formada por preguntas de selección múltiple con única respuesta, en las que encontrarás un enunciado o situación problema, seguido de cuatro opciones identificadas con las letras A, B, C y D. Solo una de ellas es la correcta.</Text>
                </Stack>
                <Stack w={'100%'} gap={2}>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }} textAlign={'justify'}>Durante el examen:
                    </Text>
                    <UnorderedList sx={{
                        '& > li ': {
                            color: colorText,
                            fontSize: { base: '1rem', md: '0.9rem' }
                        }
                    }}>
                        <ListItem >Lee atentamente cada texto o situación antes de responder. </ListItem>
                        <ListItem >Analiza la información disponible; muchas preguntas no requieren memorizar, sino razonar y aplicar conceptos.</ListItem>
                        <ListItem ><b>Marca únicamente una opción por pregunta.</b></ListItem>
                        <ListItem >Administra tu tiempo: todas las pruebas tienen un tiempo máximo total, no por área.</ListItem>
                        <ListItem >El resultado que obtengas permitirá conocer tu nivel de desarrollo en las competencias evaluadas y servirá como referencia para el ingreso a la educación superior.</ListItem>
                    </UnorderedList>
                </Stack>
                <Stack w={'100%'} gap={2} textAlign={'justify'}>
                    <Text color={colorText} fontSize={{ base: '1rem', md: '0.9rem' }}>Antes de iniciar el cuestionario tenga en cuenta que no podrá navegar entre preguntas, ni devolverse. Escoja un lugar cómodo y tranquilo, donde pueda evitar distracciones. Tendrá <b>{maxTime} minutos</b> para resolver todo el cuestionario.</Text>
                </Stack>
                <Text fontSize={{ base: '1rem', md: '0.9rem' }} fontStyle={'italic'} textAlign={'justify'} color={colorDarkText}>Recuerda: no se trata solo de saber datos, sino de demostrar comprensión, análisis y pensamiento crítico.</Text>
                <Button w={'100%'} variant={'solid'} onClick={() => handleStart()}>Comenzar prueba</Button>
            </Stack>
        </Container>

    )
}

export default InitialView