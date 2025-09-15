

import { isValid } from '../utils/validateToken'
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {

    const valid = isValid();

    if(valid){
        return children;
    }
    else{
        return <Navigate to={"/login"} replace />
    }

}

export default PrivateRoute
