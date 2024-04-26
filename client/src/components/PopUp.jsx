import styled from 'styled-components'
import PopUpThread from './PopUpThread.jsx'
import ThreadInput from './ThreadInput.jsx'

const Popup = styled.div`
`

const PopUp = ()=>{
    return(
        <Popup>
            <PopUpThread></PopUpThread>
            <ThreadInput></ThreadInput>
        </Popup>
    )
}

export default PopUp