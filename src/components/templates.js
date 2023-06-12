import { React,useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

let Templates = ()=>{
    let [templates, setTemplates] = useState([]);

    const getData = async()=> {
        await axios.get(process.env.REACT_APP_API_URL +'/admin/settings')
        .then(response => {
            // setTemplates(response.data.templates);
            let data = [];
            response.data.templates.forEach(element => {
                data.push(element)
            });
            setTemplates( data);
       }).catch(err => {
           console.log(err);
       });
    };

    useEffect(() => {
        getData()
    }, []);
    
    return(
        <div className="container-lg">
            <div className="row">
                <div className="col-12">
                    <h2 className="text-primary">Templates</h2>
                    <div className="table-responsive mb-3">
                        <table className="table table-hover table-sm table-striped mb-0">
                            <thead className="thead-dark">
                                <tr className='table-dark'>
                                    <th scope="col">Title</th>
                                    <th scope="col">Language</th>
                                    <th scope="col">Pages/File</th>
                                    <th scope="col">Items/Page</th>
                                </tr>
                            </thead>
                            <tbody>
                            {templates.map(row=>{
                                return(
                                    <tr key={row.metaId}>
                                        <td><Link to={`/admin/template/${row.metaId}`}>{row.meta_value.title }</Link></td>
                                        <td>{row.meta_value.language || ''}</td>
                                        <td>{row.meta_value.pages || 0}</td>
                                        <td>{row.meta_value.items || 0}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Templates;