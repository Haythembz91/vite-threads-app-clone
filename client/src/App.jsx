
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useEffect, useState} from "react";



const App = ()=>{

    const [showModal,setShowModal]=useState(false)
    const user = 'kubowania'
    const [users,setUsers]=useState([])
    const [threads,setThreads]=useState([])


    const getUsers = async()=>{
        const response  = await fetch(`http://localhost:8000/users/`)
        const data = await response.json()
        setUsers(data)
    }

    const getThreads = async()=>{
        const response = await fetch(`http://localhost:8000/threads`)
        const data = await response.json()
        setThreads(data.sort((a,b)=>new Date(b.time_stamp)-new Date(a.time_stamp)))

    }

    useEffect( ()=>{
        getUsers()
        getThreads()
    },[])



    return(
        <div className={'app'}>
            <Header setShowModal={setShowModal} user={user}></Header>
            <div>
                <Routes>
                    <Route path={""} element={<Home users={users} threads={threads}/>}></Route>
                    <Route path={'/users/:slug'} element={<Profile users={users} threads={threads}/>}></Route>
                </Routes>
            </div>
            {showModal && <PopUp setShowModal={setShowModal}></PopUp>}
        </div>
    )
}

export default App