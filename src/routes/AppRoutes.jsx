import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Dashboard from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import StudentTest from "../pages/StudentTest";
import StudentTests from "../pages/StudentTests";
import TestId from "../pages/TestId";
import DashboardLayout from "../layouts/DashboardLayout";
import AreaId from "../pages/AreaId";
import ComponentId from "../pages/ComponentId";
import QuestionId from "../pages/QuestionId";
import Components from "../pages/Components";
import Tests from "../pages/Tests";
import Areas from "../pages/Areas";
import Questions from "../pages/Questions";
import Users from "../pages/Users";
import Recommendations from "../pages/Recommendations";
import Metrics from "../pages/Metrics";
import TestTypes from "../pages/TestTypes";
import Results from "../pages/Results";
import SpecificResult from "../pages/SpecificResult";

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <MainLayout>
                        <Home />
                    </MainLayout>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/testtypes"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <TestTypes />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/tests"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Tests />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/areas"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Areas />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/components"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Components />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/questions"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Questions />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/users"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Users />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/results"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Results />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path='/results/:id'
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <SpecificResult />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/recommendations"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Recommendations />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/metrics"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <Metrics />
                        </DashboardLayout>
                    </MainLayout>
                }
            />



            <Route
                path="/studenttests"
                element={
                    <MainLayout>
                        <StudentTests />
                    </MainLayout>
                }
            />

            <Route
                path="/studenttest/:id"
                element={
                    <MainLayout>
                        <StudentTest />
                    </MainLayout>
                }
            />

            <Route
                path="/test/:id"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <TestId />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/test/:testId/area/:areaId"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <AreaId />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/test/:testId/area/:areaId/component/:componentId"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <ComponentId />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route
                path="/test/:testId/area/:areaId/component/:componentId/question/:questionId"
                element={
                    <MainLayout>
                        <DashboardLayout>
                            <QuestionId />
                        </DashboardLayout>
                    </MainLayout>
                }
            />

            <Route path="/login" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;
