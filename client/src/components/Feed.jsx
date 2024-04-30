import Thread from '../components/Thread.jsx'
import styled from "styled-components";
import PopUp from "./PopUp.jsx";

const FeedContainer = styled.div``

const Feed = ({user,threads})=>{
    return (
        <FeedContainer>
            {threads?.map(thread=><Thread key={thread.id} thread={thread} user={user}></Thread>)}
        </FeedContainer>
    )
}

export default Feed