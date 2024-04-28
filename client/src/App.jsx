
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'


const App = ()=>{

    const pop = false
    return(
        <div className={'app'}>
            <Header pop={pop}></Header>
            <div>
                <Routes>
                    <Route path={"/"} element={<Home/>}></Route>
                    <Route path={"/profile"} element={<Profile/>}></Route>
                </Routes>
            </div>
            {pop && <PopUp pop={pop}></PopUp>}
        </div>
    )
}

export default App