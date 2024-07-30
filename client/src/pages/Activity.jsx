import {Cookies,useCookies} from "react-cookie";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import Loader from './../components/Loader'
import { Img } from "../components/Thread";

const Activity = ({users})=>{

    const [cookies,setCookie,removeCookie]=useCookies()
    const [activities,setActivities]=useState([])
    const [showLoader,setShowLoader]=useState(true)
    

    const getNotifications =async ()=>{
        try{
            const response = await fetch('http://localhost:8000/activities',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({recipient:cookies.Handle})
            })
            const data=await response.json()
            if(response.status===200){
                setActivities(data)
            }
        }catch(error){
            console.error(error)
        }finally{
            setShowLoader(false)
        }
    }

    useEffect(()=>{
        getNotifications()
    },[])
    const timeStamp = (time)=>{
        switch (true){
            case time <60: {
                return time + 's'
                break
            }
            case time <3600: {
                return Math.ceil(time/60) + 'm'
                break
            }
            case (time/3600)<23:{
                return Math.ceil(time/3600) + 'h'
                break
            }
            case (time/(3600*24))<7:{
                return Math.ceil(time/(3600*24)) + 'd'
                break
            }
        }
    }

    return (
        <div className={'profile-page-container'}>
            {showLoader&&<Loader></Loader>}
            {activities.sort((a,b)=>a.timestamp<b.timestamp).map(activity =>
            <div key={activity.timestamp}  style={{borderBottom:'1px solid rgb(114,114,114)', padding:'15px'}}>
                <div style={{display:'flex', flexDirection:'row'}}>
                <Link to={`/users/${activity.sender_id}`}>
                        <Img><img src={users.filter(user=>user.handle===activity.sender_id)[0].img} alt={'avatar image'}/></Img>
                    </Link>
                    <p>
                    <Link style={{paddingLeft:'10px'}} to={`/users/${activity.sender_id}`}>{activity.sender_id}</Link>
                    </p>
                    <p style={{color:'rgb(114,114,114)'}}>{timeStamp(Math.ceil((new Date()-new Date(activity.timestamp))/1000))}</p>
                </div>
                {activity.notification_type==='follow'&&<p>Followed you</p>}
                {activity.notification_type!=='follow'&&<p>{activity.notification_type === 'like' ? 'Liked your' : 'Commented on your'} <Link
                    to={`/${activity.recipient_id}/${activity.post_id}`}>post</Link></p>
                }</div>)}
        </div>
    )
}

export default Activity