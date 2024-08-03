import Feed from './../components/Feed.jsx'
import Loader from './../components/Loader.jsx'
import {useEffect} from "react";



const Home = ({users,threads,getThreads,showLoader})=>{

    return (
        <div className={'profile-page-container'}>
            {showLoader&&<Loader></Loader>}
            <Feed getThreads={getThreads} users={users} threads={threads.filter(thread=>thread.reply_to===null)}></Feed>
        </div>

    )
}

export default Home