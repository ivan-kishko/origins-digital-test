import React, {useEffect} from 'react';
import './App.css';
import {Video} from "./components/Video";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataTC, StatusType} from "./redux/appReducer";
import {AppRootStateType} from "./redux/store";

function App() {
    const dispatch = useDispatch()
    const init = useSelector<AppRootStateType, StatusType>(state => state.app.appInitStatus)

    useEffect(() => {
        dispatch(fetchDataTC())
    }, [dispatch])

    if (init === 'loading') {
        return <div></div>
    }

    return (
        <div className={'app'}>
            {init === 'success' && <Video/>}
        </div>
    );
}

export default App;
