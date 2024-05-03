import styled from 'styled-components'
import PopUpThread from './PopUpThread.jsx'
import ThreadInput from './ThreadInput.jsx'

const Popup = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: rgb(0,0,0,0.8);
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    
`

const PopUp = ({setShowModal,user})=>{
    return(
        <Popup>
            <PopUpThread></PopUpThread>
            <ThreadInput user={user} setShowModal={setShowModal}></ThreadInput>
        </Popup>
    )
}

export default PopUp