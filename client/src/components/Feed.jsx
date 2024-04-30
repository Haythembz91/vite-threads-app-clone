import Thread from '../components/Thread.jsx'
import styled from "styled-components";
import PopUp from "./PopUp.jsx";

const FeedContainer = styled.div``

const Feed = ({user,threads})=>{
    return (
        <FeedContainer>
            {threads.forEach(thread=><Thread thread={thread}></Thread>)}
        </FeedContainer>
    )
}

export default Feed