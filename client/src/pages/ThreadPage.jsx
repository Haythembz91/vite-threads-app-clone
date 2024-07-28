import {useParams} from 'react-router-dom'
import Thread from "../components/Thread.jsx";
import { useEffect, useState } from 'react';


const ThreadPage = ({users,threads,getThreads})=> {

    const {user}=useParams()
    const {thread_id}=useParams()
    const post = threads.filter(item=>item.id===thread_id)[0]
    const poster = users.filter(item=>item.handle===user)
    const [replies,setReplies]=useState()

    const getReplies = async ()=>{
        try{
            const response = await fetch('http://localhost:8000/replies',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({thread_id})
            })
            const data = await response.json()
            setReplies(data)

        }catch(error){
            console.error(error)
        }
    }
    useEffect(()=>{
        getReplies()
        getThreads()
    },[])

    

    return (
        <div className={'profile-page-container'}>
            <Thread user={poster} thread={post} getThreads={getThreads}>

            </Thread>
            <h3 style={{color:'white',borderBottom:'1px solid rgb(114,114,114)'}}>Replies:</h3>
            {threads?.filter(thread=>thread.reply_to===thread_id).map(item=><Thread getThreads={getThreads} key={item.id} user={users.filter(user=>user.handle===item.thread_from)} thread={item}></Thread>)}
        </div>
        )
}

export default ThreadPage
