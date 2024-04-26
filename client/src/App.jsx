
import Feed from './components/Feed.jsx'
import Header from './components/Header.jsx'
import PopUp from './components/PopUp.jsx'





const App = ()=>{
    return(
        <div className={'app'}>
            <Header></Header>
            <Feed></Feed>
            <PopUp></PopUp>
        </div>
    )
}

export default App