
import Home from './pages/Home.jsx'
import threadPage from "./pages/ThreadPage.jsx";
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useEffect, useState} from "react";
import Auth from './components/Auth.jsx'
import {useCookies} from "react-cookie";
import ThreadPage from "./pages/ThreadPage.jsx";



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
        const response = await fetch(`http://localhost:8000/threads`,{
            method:'POST',
            headers: {'Content-Type':'application/json'},
            body:JSON.stringify({user:cookies.Handle})
        })
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
                <Header user={user} setShowModal={setShowModal} ></Header>
                <div>
                    <Routes>
                        <Route path={""} element={<Home users={users} threads={threads}/>}></Route>
                        <Route path={'/users/:slug'} element={<Profile getThreads={getThreads} users={users} threads={threads}/>}></Route>
                        <Route path={'/:user/:thread_id'} element={<ThreadPage/>}></Route>
                    </Routes>
                </div>
                {showModal && <PopUp getThreads={getThreads} user={user} showModel={showModal} setShowModal={setShowModal}></PopUp>}
            </div>}
            {!authToken&&<Auth></Auth>}
        </>

    )
}

export default App