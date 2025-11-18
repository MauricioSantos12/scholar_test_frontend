import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { Stack, Heading, Text, Divider, Box } from "@chakra-ui/react";

const Metrics = () => {
    const testData = [
        { name: "Tests", creados: 12, realizados: 8 },
    ];

    const structureData = [
        { name: "Áreas", cantidad: 3 },
        { name: "Componentes", cantidad: 9 },
    ];

    const questionsPerComponent = [
        { name: "Estadística", preguntas: 10 },
        { name: "Geometría", preguntas: 8 },
        { name: "Lectura Crítica", preguntas: 12 },
        { name: "Vocabulario", preguntas: 6 },
        { name: "Gramática", preguntas: 7 },
    ];

    const areaResults = [
        { name: "Matemáticas", puntaje: 78 },
        { name: "Lectura", puntaje: 85 },
        { name: "Inglés", puntaje: 72 },
    ];

    const componentResults = [
        { name: "Estadística", puntaje: 75 },
        { name: "Geometría", puntaje: 82 },
        { name: "Lectura Crítica", puntaje: 88 },
        { name: "Vocabulario", puntaje: 80 },
        { name: "Gramática", puntaje: 70 },
    ];

    const COLORS = ["#3182CE", "#63B3ED", "#68D391", "#F6AD55", "#E53E3E"];

    return (
        <Stack p={6} w="100%" gap={8}>
            <Heading textAlign="center" color="blue.600">
                📊 Panel de Métricas del Test
            </Heading>

            <Box h="300px">
                <Text fontWeight="bold" mb={2}>Tests creados y realizados</Text>
                <ResponsiveContainer>
                    <BarChart data={testData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="creados" fill="#3182CE" />
                        <Bar dataKey="realizados" fill="#68D391" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Divider />

            <Box h="300px">
                <Text fontWeight="bold" mb={2}>Cantidad de áreas y componentes</Text>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={structureData}
                            dataKey="cantidad"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {structureData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Box>

            <Divider />

            <Box h="300px">
                <Text fontWeight="bold" mb={2}>Preguntas por componente</Text>
                <ResponsiveContainer>
                    <BarChart data={questionsPerComponent}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="preguntas" fill="#63B3ED" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Divider />

            <Box h="300px">
                <Text fontWeight="bold" mb={2}>Resultados por área</Text>
                <ResponsiveContainer>
                    <BarChart data={areaResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="puntaje" fill="#68D391" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>

            <Box h="300px">
                <Text fontWeight="bold" mb={2}>Resultados por componente</Text>
                <ResponsiveContainer>
                    <BarChart data={componentResults}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="puntaje" fill="#F6AD55" />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Stack>
    );
};

export default Metrics;
