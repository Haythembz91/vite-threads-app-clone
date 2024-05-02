import Feed from './../components/Feed.jsx'
import {useEffect, useState} from "react";



const Home = ({users,threads})=>{





    return (
        <div className={'profile-page-container'}>
            <Feed users={users} threads={threads}></Feed>
        </div>

    )
}

export default Home