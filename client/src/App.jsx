
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
import Search from "./pages/Search.jsx";



const App = ()=>{

    const [cookies,setCookie,removeCookie]=useCookies()
    const [showModal,setShowModal]=useState(false)
    const [users,setUsers]=useState([])
    const user = users.filter(user=>user.handle===cookies.Handle)[0]
    const [threads,setThreads]=useState([])
    const authToken = cookies.AuthToken
    const [showLoader,setShowLoader]=useState(true)
    const getUsers = async()=>{
        try{
            const response  = await fetch(`${import.meta.env.VITE_SERVER_URL}/users`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({handle:cookies.Handle})
            })
            if(response.status===200){
                const data = await response.json()
                setUsers(data)
            }
        }catch(e){
            console.error(e)
        }
    }

    const getThreads = async()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/threads`,{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body:JSON.stringify({user:cookies.Handle})
            })
            if(response.status===200){
                const data = await response.json()
                setThreads(data.sort((a,b)=>new Date(b.time_stamp)-new Date(a.time_stamp)))
            }
        }catch(error){
            console.error(error)
        }finally {
            setShowLoader(false)
        }

    }
    const handleClickOutside = (e)=>{
        const modal = document.querySelector('.popUp');
        if (e.target===modal){
            setShowModal(false)
        }
    }

    useEffect( ()=>{
        if(authToken){
            getUsers().then(()=>getThreads())
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
                        <Route path={"/"} element={users&&threads&&<Home setShowModal={setShowModal} user={user} showLoader={showLoader} users={users} getThreads={getThreads} threads={threads}/>}></Route>
                        <Route path={"/search"} element={<Search getUsers={getUsers} handle={cookies.Handle} users={users}/>}></Route>
                        <Route path={'/users/:slug'} element={users&&threads&&<Profile getUsers={getUsers} getThreads={getThreads} users={users} threads={threads}/>}></Route>
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