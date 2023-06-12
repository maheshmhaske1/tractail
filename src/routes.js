import React from 'react';

//	Public pages
const Home = React.lazy(() => import( /*webpackChunkName: 'index'*/ './components/index'))
const ErrorPage = React.lazy(() => import( /*webpackChunkName: 'error'*/ './components/error'));
const Login = React.lazy(() => import( /*webpackChunkName: 'login'*/ './components/login'));
const Jobs = React.lazy(() => import( /*webpackChunkName: 'jobs'*/ './components/jobs'));
const ManageJob = React.lazy(() => import( /*webpackChunkName: 'job-manage'*/ './components/job-manage'));
const Job = React.lazy(() => import( /*webpackChunkName: 'job'*/ './components/job'));
const Codes = React.lazy(() => import( /*webpackChunkName: 'codes'*/ './components/codes'));
const Files = React.lazy(() => import( /*webpackChunkName: 'files'*/ './components/files'));
const Dashboard = React.lazy(() => import( /*webpackChunkName: 'dashboard'*/ './components/dashboard'));
const Scanner = React.lazy(() => import( /*webpackChunkName: 'scanner'*/ './components/scanner'));
const Templates = React.lazy(() => import( /*webpackChunkName: 'templates'*/ './components/templates'));
const Template = React.lazy(() => import( /*webpackChunkName: 'templates'*/ './components/template'));

// const path = document.location.pathname;
let layout = 'public';

const Routes = [
	{
		path: '/',
		element: <Home layout={layout} />
	},
	{
		path: '/login',
		element: <Login layout={layout} />
	},
	
	//	Admin Paths
	{
		path: '/admin',
		children: [
			{
				path: 'dashboard',
				element: <Dashboard layout={layout} />
			},
			{
				path: 'codes',
				element: <Codes layout={layout} />
			},
			{
				path: 'jobs',
				element: <Jobs layout={layout} />
			},
			{
				path: 'add/job',
				element: <ManageJob layout={layout} />
			},
			{
				path: 'job/:id/codes',
				element: <Codes layout={layout} />
			},
			{
				path: 'job/:id/edit',
				element: <ManageJob layout={layout} />
			},
			{
				path: 'job/:id',
				element: <Job layout={layout} />
			},
			{
				path: 'job/codes',
				element: <Codes layout={layout} />
			},
			{
				path: 'job/:id/files',
				element: <Files layout={layout} />
			},
			{
				path: 'scanner',
				element: <Scanner layout={layout} />
			},
			{
				path: 'templates',
				element: <Templates layout={layout} />
			},
			{
				path: 'template/:id',
				element: <Template layout={layout} />
			}
		]
	},
	//	User paths
	{
		path: '/user',
		children: []
	},
	{
		path: '*',
	 	element: <ErrorPage layout={layout} />
	}
];

export default Routes;