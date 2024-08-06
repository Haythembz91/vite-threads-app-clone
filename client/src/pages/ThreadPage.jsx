import {useParams} from 'react-router-dom'
import Thread from "../components/Thread.jsx";
import { useEffect, useState } from 'react';
import Feed from './../components/Feed.jsx'
import Loader from "../components/Loader.jsx";

const ThreadPage = ({users,threads,getThreads})=> {

    const {user}=useParams()
    const {thread_id}=useParams()
    const post = threads.filter(item=>item.id===thread_id)[0]
    const poster = users.filter(item=>item.handle===user)
    const [replies,setReplies]=useState()
    const [showLoader,setShowLoader]=useState(true)

    const getReplies = async ()=>{
        try{
            const response = await fetch('http://localhost:8000/replies',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({thread_id,user})
            })
            const data = await response.json()
            setReplies(data.sort((a,b)=>a.time_stamp>b.time_stamp))

        }catch(error){
            console.error(error)
        }finally {
            setShowLoader(false)
        }
    }
    useEffect(()=>{
        getReplies()
        getThreads()
    },[thread_id])

    return (
        <>
            {showLoader?<Loader></Loader>:
                <div className={'profile-page-container'}>
                    <Feed users={users} threads={replies} getThreads={getThreads}></Feed>
                    <h3 style={{color:'white',borderBottom:'1px solid rgb(114,114,114)'}}>Replies:</h3>
                    {threads?.filter(thread=>thread.reply_to===thread_id).length!==0?threads?.filter(thread=>thread.reply_to===thread_id).map(item=><Thread getThreads={getThreads} key={item.id} user={users.filter(user=>user.handle===item.thread_from)} thread={item}></Thread>):
                        <p style={{color:'rgb(104,104,104)',textAlign:'center'}}>No replies yet.</p>}
                </div>}
        </>

        )
}

export default ThreadPage
