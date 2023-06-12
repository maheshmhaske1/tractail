import { React, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

let Files = ()=>{
    const { id } = useParams();
    const [job, setRows] = useState({jobId: id, files : [],errorFiles:[]});

    const getData = async() => {
        await axios.get(process.env.REACT_APP_API_URL +'/job', {
            params: {
                jobId : id,
            }
        }).then(response => {
            if( response.data.status === 'success' ) {
                response.data.data.filesCount = response.data.data.files;
                response.data.data.files = [];
                response.data.data.errorFiles = [];
                for (let i = 1; i <= response.data.data.filesCount; i++ ) {
                    response.data.data.files.push({
                        fileId : i,
                        file_url : process.env.REACT_APP_BASE_URL +'/assets/downloads/' + response.data.data.batch + '-' + response.data.data.jobId + '-' + i + '.pdf',
                    });
                }
                if(response.data.data.error > 0 ){
                    for (let i = 1; i <= response.data.data.error; i++ ) {
                        response.data.data.errorFiles.push({
                            fileId : i,
                            file_url : process.env.REACT_APP_BASE_URL +'/assets/downloads/error' + response.data.data.batch + '-' + response.data.data.jobId + '-' + i + '.pdf',
                        });
                    }
                }
            }

            setRows(response.data.data);
        }).catch(err => {
            console.log(err);
        });
    };
    useEffect(() => {
        getData();
    }, [id]);
        
    return(
        <section className="container-lg">
            <div className="row">
                <div className="col-12">
                    <h1 className="text-primary">Files</h1>
                    <div className="table-responsive mb-3">
                        <table className="table table-hover table-sm table-striped mb-0">
                            <thead className="thead-dark">
                                <tr className='table-dark'>
                                    <th scope="col">File</th>
                                </tr>
                            </thead>
                            <tbody>
                                {job.files.map((file,idx)=>{
                                    return(
                                        <tr key={idx}>
                                            <td title="Click to download"><a className="text-reset text-decoration-none" href={file.file_url} target="_blank" download>{job.batch}-{job.jobId}-{file.fileId}.pdf</a></td>
                                        </tr>
                                    )
                                })}
                                {job.errorFiles.map((error,idx)=>{
                                    return(
                                        <tr key={idx} >
                                            <td title="Click to download" className="text-danger"><a className="text-reset text-decoration-none" href={error.file_url} target="_blank" rel="noreferrer" download>error{job.batch}-{job.jobId}-{job.fileId}.pdf</a></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Files;