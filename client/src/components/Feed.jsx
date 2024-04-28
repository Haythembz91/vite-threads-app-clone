import Thread from '../components/Thread.jsx'
import styled from "styled-components";
import PopUp from "./PopUp.jsx";

const FeedContainer = styled.div``

const Feed = ()=>{
    return (
        <FeedContainer>
            <Thread></Thread>
        </FeedContainer>
    )
}

export default Feed