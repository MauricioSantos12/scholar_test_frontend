import { Box, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    return (
        <Box textAlign="center" py={10} display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'} gap={5}>
            <Heading color="primary">EduTest</Heading>
            <Button variant={"solid"} onClick={() => navigate('/login')} >
                Comenzar
            </Button>
        </Box>
    );
};

export default Home;