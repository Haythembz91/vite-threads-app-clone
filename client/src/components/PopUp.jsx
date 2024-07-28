import styled from 'styled-components'
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
    flex-direction:column;
    
`

const PopUp = ({setShowModal,user,getThreads,showModal})=>{
    return(
        <Popup>
            <ThreadInput showModal={showModal} getThreads={getThreads} user={user} setShowModal={setShowModal}></ThreadInput>
        </Popup>
    )
}

export default PopUp