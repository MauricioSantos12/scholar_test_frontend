import { Button, Checkbox, Fade, Heading, Input, ListItem, OrderedList, Stack, Tab, Table, TableContainer, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Tfoot, Th, Thead, Tr, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Loading from '../components/Loading';
import UseFetch from '../utils/UseFetch';
import UniIcon from '../utils/UniIcon';
import ModalComponent from '../components/Modal/ModalComponent';
import InputText from '../components/InputText';
import dayjs from 'dayjs';

const GroupId = () => {
    const { id } = useParams();
    const { data: dataGroups, loading: loadingGroups, error: errorGroups, fetchData: fetchGroups } = UseFetch()
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    const { data: dataTests, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataGroupUser, loading: loadingGroupUsers, error: errorGroupUsers, fetchData: fetchGroupUsers } = UseFetch()
    const { data: dataGroupTests, loading: loadingGroupTests, error: errorGroupTests, fetchData: fetchGroupTests } = UseFetch()

    const [searchTest, setSearchTest] = useState('')
    const [searchUser, setSeachUser] = useState('')
    const [refreshData, setRefreshData] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [filteredTests, setFilteredTests] = useState('')
    const [selectedTests, setSelectedTests] = useState([])
    const navigation = useNavigate();

    const { isOpen: isOpenUsers, onOpen: onOpenUsers, onClose: onCloseUsers } = useDisclosure()
    const { isOpen: isOpenTests, onOpen: onOpenTests, onClose: onCloseTests } = useDisclosure()
    const [errorModal, setErroModal] = useState('');
    const showToast = useToast();

    useEffect(() => {
        fetchGroups({
            url: '/groups',
            method: 'GET',
        })
        fetchGroupUsers({
            url: `/groups/${parseInt(id)}/users`,
            method: 'GET'
        })
        fetchGroupTests({
            url: `/groups/${parseInt(id)}/tests`,
            method: 'GET'
        })
        fetchUsers({
            url: '/users',
            method: 'GET'
        })
        fetchTests({
            url: '/tests',
            method: 'GET'
        })
    }, [fetchGroups, fetchGroupUsers, fetchGroupTests, fetchUsers, fetchTests, refreshData])

    useEffect(() => {
        if (dataUsers) {
            if (searchUser) {
                const _filteredUsers = dataUsers.filter(user => user.name.toLowerCase().includes(searchUser.toLowerCase()) || user.last_name.includes(searchUser.toLowerCase()) || user.identification_number.includes(searchUser.toLowerCase()))
                setFilteredUsers(_filteredUsers)
            } else {
                setFilteredUsers(dataUsers)

            }
        }
    }, [dataUsers, searchUser])

    useEffect(() => {
        if (dataGroupUser && dataGroupUser.data && dataGroupUser.data.length > 0) {
            setSelectedUsers(dataGroupUser.data)
        }
    }, [dataGroupUser])

    useEffect(() => {
        if (dataTests) {
            if (searchTest) {
                const _filteredTests = dataTests.filter(test => test.name.toLowerCase().includes(searchTest.toLowerCase()) || test.description.includes(searchTest.toLowerCase()))
                setFilteredTests(_filteredTests)
            } else {
                setFilteredTests(dataTests)
            }
        }
    }, [dataTests, searchTest])

    useEffect(() => {
        if (dataGroupTests && dataGroupTests.data && dataGroupTests.data.length > 0) {
            setSelectedTests(dataGroupTests.data)
        }
    }, [dataGroupUser])

    const formatDateTime = (date) => {
        if (!date) return null;

        return new Date(date)
            .toISOString()
            .slice(0, 19)
            .replace('T', ' ');
    };


    const cleanForm = () => {
        setSeachUser('');
        setSelectedUsers([]);
        setSelectedTests([]);
        setErroModal('');
        setRefreshData(!refreshData);
    }

    const handleClose = () => {
        onCloseUsers();
        onCloseTests();
        cleanForm();
    }

    const updateConfigTest = async (test, value, key) => {
        const _filteredTests = [...filteredTests]
        const testSelected = filteredTests.find(user => user.id === test.id)
        if (key === 'available_from') {
            testSelected.available_from = formatDateTime(value)
        } else if (key === 'available_until') {
            testSelected.available_until = formatDateTime(value)
        }
        testSelected[key] = value
        _filteredTests[filteredTests.findIndex(user => user.id === test.id)] = testSelected
        const _selectedTests = [...selectedTests]
        _selectedTests[selectedTests.findIndex(user => user.id === test.id)] = testSelected
        setFilteredTests(_filteredTests)
        setSelectedTests(_selectedTests)
    }

    const onOpenConfigurationTest = (test) => {
        const _selectedTests = [...selectedTests]
        const testSelected = selectedTests.find(user => user.id === test.id)
        const _filteredTests = [...filteredTests]
        testSelected.isActive = !testSelected.isActive
        _filteredTests[filteredTests.findIndex(user => user.id === test.id)] = testSelected
        setSelectedTests(_selectedTests)
        setFilteredTests(_filteredTests)
    }

    const syncGroupUsers = async () => {
        const userIds = selectedUsers.map(user => user.id)
        try {
            const results = await fetchGroups({
                url: `/groups/${parseInt(id)}/users`,
                method: 'PUT',
                body: {
                    userIds
                }
            });
            if (results) {
                showToast({
                    title: "Actualización Exitosa",
                    description: "Los usuarios han sido actualizados con exito",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "bottom-right"
                })
                handleClose();
                cleanForm();
            }
        } catch (error) {
            console.error('Error al actualizar el grupo:', error);
        }
    }

    const syncGroupTests = async () => {
        const _selectedTests = [...selectedTests]
        _selectedTests.forEach(test => {
            if (test.available_from) {
                test.available_from = formatDateTime(test.available_from)
            }
            if (test.available_until) {
                test.available_until = formatDateTime(test.available_until)
            }
        })
        try {
            const results = await fetchGroups({
                url: `/groups/${parseInt(id)}/tests`,
                method: 'PUT',
                body: {
                    tests: _selectedTests
                }
            });
            if (results) {
                showToast({
                    title: "Actualización Exitosa",
                    description: "Los tests han sido actualizados con exito",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "bottom-right"
                })
                handleClose();
                cleanForm();
            }
        } catch (error) {
            console.error('Error al actualizar el grupo:', error);
        }
    }

    const colorDarkText = useColorModeValue('dark_text', 'secondary.100');
    const colorText = useColorModeValue('text', 'secondary.200');
    const bgColorActiveRowColorMode = useColorModeValue('#F8FAFC', 'secondary.700');
    const bgColorRowColorMode = useColorModeValue('white', 'secondary.800');

    if (loadingGroups || loadingGroupUsers || loadingGroupTests || loadingUsers || loadingTests) return <Loading />
    if (errorGroups || errorGroupUsers || errorGroupTests || errorUsers || errorTests) return <Text color={'red.500'}>Error: {errorGroups || errorGroupUsers || errorGroupTests || errorUsers || errorTests}</Text>

    return (
        <Stack dir='column' justifyContent={'flex-start'} alignItems={'flex-start'} gap={3} w={'100%'} h='100%'>
            {
                dataGroups && dataGroups.length > 0 && (
                    <Heading color={colorDarkText} fontSize={{ base: 'xl', md: '3xl' }} cursor={'pointer'} onClick={() => navigation('/groups')}>{`Grupo: ${dataGroups.find(test => test.id === parseInt(id))?.name}`}</Heading>

                )
            }

            <Text color={colorText} fontSize={{ base: '0.8rem', md: '0.9rem' }}>Acá podrás configurar los test y estudiantes relacionados al grupo</Text>

            <Stack w='100%' padding={3} border={'1px solid'} borderColor='#E2E8F0' borderRadius={8}>

                <Tabs variant='enclosed' w='100%'>
                    <TabList>
                        <Tab>Usuarios</Tab>
                        <Tab>Tests</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                            <Stack w='100%'>
                                <Stack w='100%' flexDir={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Heading fontSize={'xl'}>Listado de usuarios</Heading>
                                    <Button variant={"solid"} size="sm" onClick={onOpenUsers} minHeight={10} rightIcon={<UniIcon icon={'UilPen'} size={4} color='white' />}> Administrar estudiantes</Button>
                                </Stack>

                                {
                                    dataGroupUser && dataGroupUser.data.length > 0 ?
                                        <OrderedList>
                                            {
                                                dataGroupUser.data.map(user => {
                                                    return (
                                                        <ListItem>{user.name + ' ' + user.last_name} </ListItem>
                                                    )
                                                })
                                            }
                                        </OrderedList>
                                        :
                                        <Text>No hay usuarios agregados a este grupo</Text>
                                }
                            </Stack>
                        </TabPanel>
                        <TabPanel>
                            <Stack w='100%'>
                                <Stack w='100%' flexDir={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                    <Heading fontSize={'xl'}>Listado de tests</Heading>
                                    <Button variant={"solid"} size="sm" onClick={onOpenTests} minHeight={10} rightIcon={<UniIcon icon={'UilPen'} size={4} color='white' />}> Administrar tests</Button>
                                </Stack>
                                {
                                    dataGroupTests && dataGroupTests.data.length > 0 ?
                                        <OrderedList>
                                            {
                                                dataGroupTests.data.map(user => {
                                                    return (
                                                        <ListItem>{user.name} </ListItem>
                                                    )
                                                })
                                            }
                                        </OrderedList>
                                        :
                                        <Text>No hay tests agregados a este grupo</Text>
                                }
                            </Stack>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Stack>

            <ModalComponent isOpen={isOpenUsers} onClose={handleClose} title={'Administrar usuarios'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <Stack>
                            <Text>Buscar:</Text>
                            <Input value={searchUser} onChange={(e) => setSeachUser(e.target.value)} variant='outline' placeholder='Pablo Pérez' />
                        </Stack>   {
                            filteredUsers && filteredUsers.length > 0 ?
                                <Stack>
                                    <TableContainer w={'100%'}>
                                        <Table variant='simple' size={'lg'} color={colorDarkText}>
                                            <Thead color={colorDarkText}>
                                                <Tr>
                                                    <Th textAlign={'center'}></Th>
                                                    <Th textAlign={'center'}>Nombre</Th>
                                                    <Th textAlign={'center'}>Apellido</Th>
                                                    <Th textAlign={'center'}>Identificación</Th>

                                                </Tr>
                                            </Thead>
                                            <Tbody color={colorDarkText}>
                                                {filteredUsers.map((dt, i) => {
                                                    const isSelected = selectedUsers.find(user => user.id === dt.id)
                                                    return (
                                                        <Tr key={`${dt.id}-${dt.name}-${i}`} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                                            <Td textAlign={'center'}><Checkbox isChecked={isSelected ? true : false} onChange={() => {
                                                                if (isSelected) {
                                                                    setSelectedUsers(selectedUsers.filter(user => user.id !== dt.id))
                                                                } else {
                                                                    setSelectedUsers([...selectedUsers, dt])
                                                                }
                                                            }} /></Td>
                                                            <Td textAlign={'center'}>{dt.name}</Td>
                                                            <Td textAlign={'center'}>{dt.last_name}</Td>
                                                            <Td textAlign={'center'}>{dt.identification_number}</Td>
                                                        </Tr>
                                                    )
                                                })}
                                            </Tbody>


                                        </Table>
                                    </TableContainer>

                                    <Stack w={'100%'}>
                                        {
                                            selectedUsers && selectedUsers.length > 0 && (
                                                <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w={'100%'}>
                                                    <Text >{selectedUsers.length} Usuarios seleccionados</Text>
                                                </Stack>
                                            )

                                        }
                                        <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w={'100%'}>
                                            <Button variant={'outline'} w='auto' size={'sm'} onClick={() => {
                                                setSelectedUsers([])
                                            }}>Limpiar selección</Button>
                                            <Button variant={'darkGray'} w='auto' size={'sm'} onClick={() => {
                                                syncGroupUsers()
                                            }}>Guardar selección</Button>
                                        </Stack>
                                    </Stack>

                                </Stack>
                                :
                                <Text>No hay usuarios que Administrar</Text>
                        }

                    </Stack>
                </Stack>
            </ModalComponent>

            <ModalComponent isOpen={isOpenTests} onClose={handleClose} title={'Administrar tests'}>
                <Stack w='100%' gap={2}>
                    <Stack>
                        <Stack>
                            <Text>Buscar:</Text>
                            <Input value={searchTest} onChange={(e) => setSearchTest(e.target.value)} variant='outline' placeholder='Prueba ICFES' />
                        </Stack>   {
                            filteredTests && filteredTests.length > 0 ?
                                <Stack>
                                    <TableContainer w={'100%'}>
                                        <Table variant='simple' size={'lg'} color={colorDarkText}>
                                            <Thead color={colorDarkText}>
                                                <Tr>
                                                    <Th textAlign={'center'}></Th>
                                                    <Th textAlign={'center'}>Nombre</Th>
                                                    <Th textAlign={'center'}>Configuración</Th>

                                                </Tr>
                                            </Thead>
                                            <Tbody color={colorDarkText}>
                                                {filteredTests.map((dt, i) => {
                                                    const isSelected = selectedTests.find(user => user.id === dt.id)
                                                    const data = selectedTests.find(user => user.id === dt.id)
                                                    console.log({ dt })
                                                    const availableFromDate = dayjs(dt.available_from).format('YYYY-MM-DDThh:mm:ss')
                                                    const availableUntilDate = dayjs(dt.available_until).format('YYYY-MM-DDThh:mm:ss')
                                                    console.log({ availableFromDate })
                                                    return (
                                                        <>
                                                            <Tr key={dt.id} bgColor={i % 2 === 0 ? bgColorActiveRowColorMode : bgColorRowColorMode}>
                                                                <Td textAlign={'center'}><Checkbox isChecked={isSelected ? true : false} onChange={() => {
                                                                    if (isSelected) {
                                                                        setSelectedTests(selectedTests.filter(user => user.id !== dt.id))
                                                                    } else {
                                                                        setSelectedTests([...selectedTests, { ...dt, max_attempts: 1, available_from: new Date(), available_until: new Date(), isActive: false }])
                                                                    }
                                                                }} /></Td>
                                                                <Td textAlign={'center'}>{dt.name}</Td>
                                                                <Td textAlign={'center'}>
                                                                    {
                                                                        isSelected && (
                                                                            <Stack w='100%' mt={1} >
                                                                                <Button h={8} variant='outline' onClick={() => onOpenConfigurationTest(dt)}>Configurar {data.isActive ? <UniIcon icon={'UilAngleUp'} size={6} /> : <UniIcon icon={'UilAngleDown'} size={6} />}</Button>
                                                                                <Fade in={data.isActive} unmountOnExit>
                                                                                    <Stack w='100%'>
                                                                                        <InputText props={{
                                                                                            h: 6,
                                                                                            fontSize: 'sm',
                                                                                        }} text={'# intentos'} placeholder={'Descripcion del test'} type={'text'} value={dt.max_attempts} setValue={(e) => {
                                                                                            updateConfigTest(dt, e, 'max_attempts')
                                                                                        }} />
                                                                                        <InputText props={{
                                                                                            h: 6,
                                                                                            fontSize: 'sm',
                                                                                        }} text={'Disponible desde'} placeholder={'Disponible desde'} type={'date'} value={availableFromDate} setValue={(e) => {
                                                                                            updateConfigTest(dt, e.target.value, 'available_from')
                                                                                        }} />
                                                                                        <InputText props={{
                                                                                            h: 6,
                                                                                            fontSize: 'sm',
                                                                                        }} text={'Disponible hasta'} placeholder={'Disponible hasta'} type={'date'} value={availableUntilDate} setValue={(e) => {
                                                                                            updateConfigTest(dt, e.target.value, 'available_until')
                                                                                        }} />
                                                                                    </Stack>
                                                                                </Fade>

                                                                            </Stack>

                                                                        )
                                                                    }
                                                                </Td>
                                                            </Tr>

                                                        </>
                                                    )
                                                })}
                                            </Tbody>


                                        </Table>
                                    </TableContainer>

                                    <Stack w={'100%'}>
                                        {
                                            selectedTests && selectedTests.length > 0 && (
                                                <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w={'100%'}>
                                                    <Text >{selectedTests.length} Tests seleccionados</Text>
                                                </Stack>
                                            )

                                        }
                                        <Stack flexDir={'row'} justifyContent={'flex-end'} alignItems={'center'} w={'100%'}>
                                            <Button variant={'outline'} w='auto' size={'sm'} onClick={() => {
                                                setSelectedTests([])
                                            }}>Limpiar selección</Button>
                                            <Button variant={'darkGray'} w='auto' size={'sm'} onClick={() => {
                                                syncGroupTests()
                                            }}>Guardar selección</Button>
                                        </Stack>
                                    </Stack>

                                </Stack>
                                :
                                <Text>No hay usuarios que Administrar</Text>
                        }

                    </Stack>
                </Stack>
            </ModalComponent>

        </Stack >
    )
}

export default GroupId