import Thread from '../components/Thread.jsx'
import styled from "styled-components";


const FeedContainer = styled.div``

const Feed = ({users,threads})=>{



    return (
        <FeedContainer>
            {threads.map(thread=><Thread key={thread.id} thread={thread} user={users.filter(item=>
                item.handle===thread.thread_from)}></Thread>)}
        </FeedContainer>
    )
}

export default Feed