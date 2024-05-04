
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useEffect, useState} from "react";
import Auth from './components/Auth.jsx'
import {useCookies} from "react-cookie";



const App = ()=>{

    const [cookies,setCookie,removeCookie]=useCookies()
    const [showModal,setShowModal]=useState(false)
    const [users,setUsers]=useState([])
    const user = users.filter(user=>user.handle===cookies.Handle)[0]
    const [threads,setThreads]=useState([])
    const authToken = cookies.AuthToken

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
        if(authToken){
            getUsers()
            getThreads()
        }

    },[])

    return(
        <>
            {authToken&&<div className={'app'}>
                <Header setShowModal={setShowModal} ></Header>
                <div>
                    <Routes>
                        <Route path={""} element={<Home users={users} threads={threads}/>}></Route>
                        <Route path={'/users/:slug'} element={<Profile users={users} threads={threads}/>}></Route>
                    </Routes>
                </div>
                {showModal && <PopUp getThreads={getThreads} user={user} setShowModal={setShowModal}></PopUp>}
            </div>}
            {!authToken&&<Auth></Auth>}
        </>

    )
}

export default App