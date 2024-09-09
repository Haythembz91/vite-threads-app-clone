import {useParams} from 'react-router-dom'
import Thread from "../components/Thread.jsx";
import { useEffect, useState } from 'react';
import Loader from "../components/Loader.jsx";

const ThreadPage = ({users,threads,getThreads})=> {

    const {user}=useParams()
    const {thread_id}=useParams()
    const [replies,setReplies]=useState()
    const [showLoader,setShowLoader]=useState(true)

    const getReplies = async ()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/replies`,{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({thread_id,user})
            })
            const data = await response.json()
            setReplies(data.sort((a,b)=>new Date(a.time_stamp)-new Date(b.time_stamp)))

        }catch(error){
            console.error(error)
        }finally {
            setShowLoader(false)
        }
    }
    useEffect(()=>{
        getThreads().then(getReplies())
    },[thread_id])

    return (
        <>
            {showLoader?<Loader></Loader>:
                <div className={'profile-page-container'}>
                    {replies?.map((thread,index)=>
                        <div key={index}>
                            <Thread getThreads={getThreads}
                                    user={users.filter(u => u.handle === thread.thread_from)} thread={thread}></Thread>
                            {replies.length!==index+1&&<hr style={{
                                transform: 'rotate(90deg) translate(-39px, 13px)',
                                width: '75px',
                                position: 'absolute'
                            }}/>}
                        </div>
                    )}
                    <h3 style={{color:'white',borderBottom:'1px solid rgb(114,114,114)'}}>Replies:</h3>
                    {threads?.filter(thread=>thread.reply_to===thread_id).length!==0?threads?.filter(thread=>thread.reply_to===thread_id).map(item=><Thread getThreads={getThreads} key={item.id} user={users.filter(user=>user.handle===item.thread_from)} thread={item}></Thread>):
                        <p style={{color:'rgb(104,104,104)',textAlign:'center'}}>No replies yet.</p>}
                </div>}
        </>

        )
}

export default ThreadPage
