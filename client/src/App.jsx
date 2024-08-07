
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useEffect, useState} from "react";
import Auth from './components/Auth.jsx'
import {useCookies} from "react-cookie";
import ThreadPage from "./pages/ThreadPage.jsx";
import Activity from "./pages/Activity.jsx";



const App = ()=>{

    const [cookies,setCookie,removeCookie]=useCookies()
    const [showModal,setShowModal]=useState(false)
    const [users,setUsers]=useState([])
    const user = users.filter(user=>user.handle===cookies.Handle)[0]
    const [threads,setThreads]=useState([])
    const authToken = cookies.AuthToken
    const [showLoader,setShowLoader]=useState(true)
    const getUsers = async()=>{
        const response  = await fetch(`http://localhost:8000/users/`)
        const data = await response.json()
        setUsers(data)
    }

    const getThreads = async()=>{
        try{
            const response = await fetch(`http://localhost:8000/threads`,{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({user:cookies.Handle})
            })
            const data = await response.json()
            setThreads(data.sort((a,b)=>new Date(b.time_stamp)-new Date(a.time_stamp)))
        }catch(error){
            console.error(error)
        }finally{
            setShowLoader(false)
        }

    }
    const handleClickOutside = (e)=>{
        const modal = document.querySelector('.kGcdEL');
        if (e.target===modal){
            setShowModal(false)
        }
    }

    useEffect( ()=>{
        if(authToken){
            getUsers()
            getThreads()
        }

    },[])

    useEffect(()=>{
        document.addEventListener('mousedown',handleClickOutside)
        return ()=>{
            document.removeEventListener('mousedown',handleClickOutside)
        }
    },[showModal])

    useEffect(()=>{
        const handleKeyDown = (e)=>{
            if(e.key==='Escape'){
                setShowModal(false)
            }
        }
        document.addEventListener('keydown',handleKeyDown)
        return ()=>{
            document.removeEventListener('keydown',handleKeyDown)
        }
    },[showModal])


    return(
        <>
            {authToken&&<div className={'app'}>
                <Header user={user} setShowModal={setShowModal} ></Header>
                <div>
                    <Routes>
                        <Route path={"/"} element={<Home showLoader={showLoader} users={users} getThreads={getThreads} threads={threads}/>}></Route>
                        <Route path={'/users/:slug'} element={<Profile getThreads={getThreads} users={users} threads={threads}/>}></Route>
                        <Route path={'/:user/post/:thread_id'} element={<ThreadPage getThreads={getThreads} showModal={showModal} setShowModal={setShowModal} users={users} threads={threads}/>}></Route>
                        <Route path={'/activities'} element={<Activity users={users} />}></Route>
                    </Routes>
                </div>
                {showModal && <PopUp getThreads={getThreads} user={user} showModal={showModal} setShowModal={setShowModal}></PopUp>}
            </div>}
            {!authToken&&<Auth></Auth>}
        </>
    )
}
export default App