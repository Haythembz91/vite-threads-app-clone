
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useEffect, useState} from "react";


const App = ()=>{

    const [showModal,setShowModal]=useState(false)
    const [user,setUser]=useState('kubowania')
    const [threads,setThreads]=useState(null)
    const [followers,setFollowers]=useState(0)
    const handle = 'kubowania'

    const getUserData = async()=>{
        const response  = await fetch(`http://localhost:8000/users/${handle}`)
        const data = await response.json()
        setUser(data.users[0])
        setFollowers(data.followers[0].count)
    }

    const getThreads = async()=>{
        const response = await fetch(`http://localhost:8000/${handle}/threads`)
        const data = await response.json()
        setThreads(data.sort((a,b)=>new Date(b.time_stamp)-new Date(a.time_stamp)))

    }

    useEffect( ()=>{
        getUserData()
        getThreads()
    },[])




    return(
        <div className={'app'}>
            <Header setShowModal={setShowModal} user={user}></Header>
            <div>
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={`/${user.handle}`} element={<Profile user={user} threads={threads} followers={followers}/>}></Route>
                </Routes>
            </div>
            {showModal && <PopUp setShowModal={setShowModal}></PopUp>}
        </div>
    )
}

export default App