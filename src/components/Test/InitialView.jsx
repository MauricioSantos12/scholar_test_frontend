import { Button, Divider, Heading, ListItem, Stack, Text, UnorderedList } from '@chakra-ui/react'
import React from 'react'

const InitialView = ({ completeTest, setStep, fetchTests, user, setTestResult, setStartTime }) => {
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

    return (
        <Stack w='100%' gap={4} >
            <Stack my={4} w={'100%'} gap={2}>
                <Heading color={'dark_text'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '0.9rem', md: '1.5rem' }}>{`Bienvenido a la prueba ${completeTest.name}`}</Heading>
                {/* <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>{completeTest.description}</Text> */}
            </Stack>
            {/* <Divider /> */}
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }} fontWeight={'bold'} textAlign={'center'}>  ¡Bienvenido(a)! </Text>
                <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>El examen de Estado Saber 11° es una evaluación estandarizada que aplica el ICFES con el propósito de medir las competencias desarrolladas por los estudiantes al finalizar la educación media. Estas competencias reflejan la capacidad de usar los conocimientos adquiridos en distintas áreas para comprender, analizar y resolver situaciones del entorno académico y cotidiano.                </Text>
            </Stack>
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>El examen se compone de cinco pruebas:
                </Text>
                <UnorderedList sx={{
                    '& > li ': {
                        color: 'text',
                        fontSize: { base: '1rem', md: '0.9rem' }
                    }
                }}>
                    <ListItem>Matemáticas</ListItem>
                    <ListItem>Lectura Crítica</ListItem>
                    <ListItem>Sociales y Ciudadanas </ListItem>
                    <ListItem>Ciencias Naturales </ListItem>
                    <ListItem>Inglés  </ListItem>
                </UnorderedList>
            </Stack>
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>Cada prueba está formada por preguntas de selección múltiple con única respuesta, en las que encontrarás un enunciado o situación problema, seguido de cuatro opciones identificadas con las letras A, B, C y D. Solo una de ellas es la correcta.</Text>
            </Stack>
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>Durante el examen:
                </Text>
                <UnorderedList sx={{
                    '& > li ': {
                        color: 'text',
                        fontSize: { base: '1rem', md: '0.9rem' }
                    }
                }}>
                    <ListItem>Lee atentamente cada texto o situación antes de responder.  </ListItem>
                    <ListItem>Analiza la información disponible; muchas preguntas no requieren memorizar, sino razonar y aplicar conceptos.</ListItem>
                    <ListItem>Selecciona únicamente una opción por pregunta.</ListItem>
                    <ListItem> Administra tu tiempo: todas las pruebas tienen un tiempo máximo total, no por área.</ListItem>
                    <ListItem> El resultado que obtengas permitirá conocer tu nivel de desarrollo en las competencias evaluadas y servirá como referencia para el ingreso a la educación superior.</ListItem>
                </UnorderedList>
            </Stack>
            <Text fontSize={{ base: '1rem', md: '0.9rem' }} fontStyle={'italic'}>Recuerda: no se trata solo de saber datos, sino de demostrar comprensión, análisis y pensamiento crítico.</Text>

            <Button w={'100%'} variant={'solid'} onClick={() => handleStart()}>Comenzar prueba</Button>
        </Stack>
    )
}

export default InitialView