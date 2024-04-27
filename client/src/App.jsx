
import Feed from './pages/Feed.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'
import {Route,Routes} from "react-router-dom";
import Profile from './pages/Profile.jsx'


const App = ()=>{
    return(
        <div className={'app'}>
            <Header></Header>
            <div>
                <Routes>
                    <Route path={"/home"} element={<Feed/>}></Route>
                    <Route path={"/profile"} element={<Profile/>}></Route>
                </Routes>
            </div>

        </div>
    )
}

export default App