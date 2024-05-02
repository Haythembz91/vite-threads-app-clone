import Feed from './../components/Feed.jsx'
import {useEffect, useState} from "react";



const Home = ()=>{

    const [users,setUsers]=useState([])
    const [threads,setThreads]=useState([])


    const getUsers = async()=>{
        const response  = await fetch(`http://localhost:8000/users/`)
        const data = await response.json()
        setUsers(data)
    }

    const getThreads = async()=>{
        const response = await fetch(`http://localhost:8000/threads`)
        const data = await response.json()
        setThreads(data.sort((a,b)=>new Date(b.time_stamp)-new Date(a.time_stamp)))

    }

    useEffect( ()=>{
        getUsers()
        getThreads()
    },[])



    return (
        <div className={'profile-page-container'}>
            <Feed users={users} threads={threads}></Feed>
        </div>

    )
}

export default Home