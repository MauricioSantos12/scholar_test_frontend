import { Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UseFetch from '../utils/UseFetch';
import Loading from '../components/Loading.jsx';
import ResultsComponent from '../components/ResultsComponent.jsx';

const SpecificResult = () => {
    const { data, loading: loadingTests, error: errorTests, fetchData: fetchTests } = UseFetch()
    const { data: dataUsers, loading: loadingUsers, error: errorUsers, fetchData: fetchUsers } = UseFetch()
    const { data: dataRecommendations, loading: loadingRecommendations, error: errorRecommendations, fetchData: fetchRecommendations } = UseFetch()

    const [completeTest, setCompletTest] = useState([]);
    const [completeResults, setCompletResults] = useState([]);
    const { id } = useParams();
    const user = dataUsers && dataUsers.length > 0 && dataUsers.find((user) => user._id === data?.user);

    const getFullTest = async () => {

        const _completeResults = await fetchTests({
            url: `/results/${id}`,
            method: 'GET',
        })
        if (_completeResults) {
            setCompletResults(_completeResults);
            const _completeTest = await fetchTests({
                url: `/tests/${_completeResults?.test_id}/full`,
                method: 'GET',
            })
            if (_completeTest) {
                let _totalQuestions = [];
                _completeTest.areas.forEach((area) => {
                    if (area?.questionsByArea) {
                        _totalQuestions = [...area.questionsByArea, ..._totalQuestions]

                    }
                })
                setCompletTest(_completeTest);
            }

        }
    }

    useEffect(() => {
        fetchTests({
            url: '/tests',
            method: 'GET',
        });
        fetchUsers({
            url: '/users',
            method: 'GET',
        });
        fetchRecommendations({
            url: '/recommendations',
            method: 'GET',
        })

        getFullTest();

    }, [fetchTests]);


    if (errorTests || errorRecommendations || errorUsers) return <Text color={'red.500'}>Error: {errorTests || errorRecommendations || errorUsers}</Text>;
    if (loadingTests || loadingRecommendations || loadingUsers || (completeTest && completeTest.length === 0)) return <Loading />

    return (
        <ResultsComponent completeTest={completeTest} completeResults={completeResults} user={user} dataRecommendations={dataRecommendations} />
    )
}

export default SpecificResult