import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import UniIcon from '../../utils/UniIcon';

const AreaView = ({ completeTest, setStep, areaStep }) => {
  const area = completeTest.areas[areaStep];
  const handleStart = () => {
    setStep('questionView');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  return (
    <Stack w='100%' gap={4} id='mainContentTest'>
      <Breadcrumb spacing='4px' fontSize={{ base: 'xs', md: 'md' }} >
        <BreadcrumbItem><BreadcrumbLink>{completeTest?.name} </BreadcrumbLink> </BreadcrumbItem>
      </Breadcrumb>
      <Stack my={4} w={'100%'} gap={2}>
        <Heading color={'dark_text'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '0.9rem', md: '1.5rem' }}>{`Área: ${area.name}`}</Heading>
      </Stack>
      <Divider />
      <Stack w={'100%'} gap={2}>
        <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>En esta sección encontrarás preguntas relacionadas con el área de <b>{area?.name}</b>. Su propósito es evaluar tus habilidades y comprensión en los temas propios de esta área.</Text>
        <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>Responde cada pregunta de manera reflexiva y elige la opción que consideres más adecuada.</Text>
        <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>{area?.description}</Text>
      </Stack>
      <Divider />
      {
        area?.description && (
          <Text color={'text'} fontSize={{ base: '1rem', md: '0.9rem' }}>{area?.description}</Text>
        )
      }
      <Button w={'100%'} variant={'solid'} onClick={() => { handleStart() }}>Iniciar área</Button>
    </Stack>
  )
}

export default AreaView