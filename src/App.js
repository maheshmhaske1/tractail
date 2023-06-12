import React, { Suspense } from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import routes from './routes';
import Header from './components/header';

let path = document.location.pathname;
let layout = 'public';
if( /^\/admin/i.test( path ) ) {
    layout = 'admin';
}

const AppRoutes = (props) => {
    return useRoutes(routes);
};

function App() {
    return (
        <BrowserRouter>
            <Header/>
            <main className='py-3' >
                <Suspense fallback={<div style={{ height: 'calc( 100vh - var( --fixed-top-spacing ) - 2.5rem )', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
                    <AppRoutes layout={layout} />
                </Suspense>     
            </main>
        </BrowserRouter>
    );
}

export default App;