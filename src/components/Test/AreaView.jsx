import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Divider, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import UniIcon from '../../utils/UniIcon';

const AreaView = ({ completeTest, setStep, areaStep }) => {
  const area = completeTest.areas[areaStep];
  const handleStart = () => {
    setStep('questionView');
  }

  return (
    <Stack w='100%' gap={4} >
      <Breadcrumb spacing='8px' separator={<UniIcon size={5} icon='UilAngleRightB' color='gray.500' />}>
        <BreadcrumbItem><BreadcrumbLink>{completeTest?.name} </BreadcrumbLink> </BreadcrumbItem>
      </Breadcrumb>
      <Stack my={4} w={'100%'} gap={2}>
        <Heading color={'dark_text'} textAlign={'center'} fontWeight={'bold'} fontSize={{ base: '1.2rem', md: '2rem' }}>{`Área: ${area.name}`}</Heading>
      </Stack>
      <Divider />
      <Stack w={'100%'} gap={2}>
        <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>En esta sección encontrarás preguntas relacionadas con el área de <b>{area?.name}</b>. Su propósito es evaluar tus habilidades y comprensión en los temas propios de esta área.</Text>
        <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>Responde cada pregunta de manera reflexiva y elige la opción que consideres más adecuada.</Text>
        <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>{area?.description}</Text>
      </Stack>
      <Divider />
      {
        area?.description && (
          <Text color={'text'} fontSize={{ base: '1rem', md: '1.2rem' }}>{area?.description}</Text>
        )
      }
      <Button w={'100%'} variant={'solid'} onClick={() => { handleStart() }}>Iniciar área</Button>
    </Stack>
  )
}

export default AreaView