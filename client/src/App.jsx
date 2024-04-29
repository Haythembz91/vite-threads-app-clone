
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useEffect, useState} from "react";


const App = ()=>{

    const [showModal,setShowModal]=useState(false)
    const [user,setUser]=useState('kubowania')
    const [followers,setFollowers]=useState(0)
    const handle = 'kubowania'
    const getUserData = async()=>{
        const response  = await fetch(`http://localhost:8000/${handle}`)
        const data = await response.json()
        setUser(data.users[0])
        setFollowers(data.followers[0].count)
    }
    useEffect( ()=>{
        getUserData()
    },[])

    return(
        <div className={'app'}>
            <Header setShowModal={setShowModal} user={user}></Header>
            <div>
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={`/${user.handle}`} element={<Profile user={user} followers={followers}/>}></Route>
                </Routes>
            </div>
            {showModal && <PopUp setShowModal={setShowModal}></PopUp>}
        </div>
    )
}

export default App