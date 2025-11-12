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
    }

    return (
        <Stack w='100%' gap={4} >
            <Stack my={4} w={'100%'} gap={2}>
                <Heading color={'dark_text'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '1.2rem', md: '2rem' }}>{`Bienvenido a la prueba ${completeTest.name}`}</Heading>
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>{completeTest.description}</Text>
            </Stack>
            <Divider />
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>El objetivo de este ejercicio es conocer tus habilidades, actitudes y nivel de razonamiento frente a diferentes situaciones que podrían presentarse en un entorno laboral o académico. A lo largo del test encontrarás preguntas agrupadas por áreas y competencias específicas, cada una diseñada para evaluar distintas dimensiones de tu perfil.</Text>
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>Cada pregunta contará con respuestas de <b>opción múltiple</b>, y deberás seleccionar aquella que consideres <b>más apropiada o cercana a tu forma de actuar o pensar.</b></Text>
            </Stack>
            <Divider />
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontWeight={'bold'} fontSize={{ base: '1rem', md: '1.2rem' }}>🔎 Estructura del test</Text>
                <UnorderedList>
                    <ListItem><b>Áreas:</b> representan grandes categorías de conocimiento o habilidades (por ejemplo: Comunicación, Liderazgo, Pensamiento Lógico, etc.).</ListItem>
                    <ListItem><b>Competencias:</b> dentro de cada área, se evaluarán capacidades específicas relacionadas con ella.</ListItem>
                    <ListItem><b>Preguntas:</b> cada competencia incluye una serie de preguntas con distintas opciones de respuesta.</ListItem>
                </UnorderedList>
            </Stack>
            <Divider />
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontWeight={'bold'} fontSize={{ base: '1rem', md: '1.2rem' }}>🎯 Tu tarea</Text>
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>Deberás analizar cuidadosamente cada situación y elegir la respuesta que mejor refleje tu criterio o manera de responder ante ese escenario.</Text>
                <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>No hay respuestas correctas o incorrectas: el propósito es identificar tus fortalezas y áreas de mejora.</Text>
            </Stack>
            <Divider />
            <Stack w={'100%'} gap={2}>
                <Text color={'text'} fontWeight={'bold'} fontSize={{ base: '1rem', md: '1.2rem' }}>💡 Observaciones</Text>
                <UnorderedList>
                    <ListItem>Lee cada enunciado con atención.</ListItem>
                    <ListItem>Responde con sinceridad, basándote en lo que harías normalmente.</ListItem>
                    <ListItem>Evita cambiar tus respuestas con frecuencia; confía en tu primera intuición.</ListItem>
                    <ListItem>Una vez que finalices todas las áreas, podrás ver tus resultados generales y por competencia.</ListItem>
                </UnorderedList>
            </Stack>
            <Button w={'100%'} variant={'solid'} onClick={() => handleStart()}>Comenzar prueba</Button>
        </Stack>
    )
}

export default InitialView