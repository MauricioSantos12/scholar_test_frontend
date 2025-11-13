import { Button, Stack, Text } from '@chakra-ui/react'
import React from 'react'
import UniIcon from "../utils/UniIcon.jsx";

const Paginator = ({ totalPages, setPage, page }) => {
    return (
        <Stack flexDir={'row'} justifyContent={'center'} alignItems={'center'} w='100%'>
            <Button onClick={() => setPage(page - 1)} disabled={page === 1} variant={'gray'}><UniIcon icon={'UilAngleLeft'} /></Button>
            <Text>{page} de {totalPages}</Text>
            <Button onClick={() => setPage(page + 1)} disabled={page === totalPages} variant={'gray'}><UniIcon icon={'UilAngleRight'} /></Button>
        </Stack>
    )
}

export default Paginator