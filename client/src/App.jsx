
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'
import {useState} from "react";



const App = ()=>{

    const [showModal,setShowModal]=useState(false)
    const user = 'kubowania'




    return(
        <div className={'app'}>
            <Header setShowModal={setShowModal} user={user}></Header>
            <div>
                <Routes>
                    <Route path={""} element={<Home/>}></Route>
                    <Route path={'/users/:slug'} element={<Profile/>}></Route>
                </Routes>
            </div>
            {showModal && <PopUp setShowModal={setShowModal}></PopUp>}
        </div>
    )
}

export default App