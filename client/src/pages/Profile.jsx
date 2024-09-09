import styled from "styled-components";
import {useEffect, useState} from "react";
import Feed from './../components/Feed.jsx'
import {useParams} from "react-router-dom";
import {useCookies} from "react-cookie";
import EditProfile from "../components/EditProfile.jsx";
import Thread from "../components/Thread.jsx";


const UserInfoContainer = styled.div`
  font-family: 'Segoe UI Symbol', Arial, sans-serif;
    h1{
        font-weight: bold;
        font-size: 24px;
    }
  span{
    background-color: rgb(59,59,59);
    color: rgb(114,114,114);
    font-size:13px;
    padding: 3px 6px;
    border-radius: 20px;
    
  }
`
const InfoContainer = styled.div`
    display: flex;
    justify-content: space-between;
`
export const ImageContainer = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  img{
    width: 100%;
  }
`
export const SubInfoContainer = styled.div`
  color: rgb(114,114,114);
  a{
    text-decoration: none;
    color: rgb(114,114,114);
  }
`
export const ButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  
    button{
        border: none;
        background-color: transparent;
        padding: 7px;
        color:rgb(114,114,114);
        border-bottom: 1px solid rgb(114,114,114);
        font-weight: bold;
        cursor: pointer;
    }
`



const Profile = ({users,threads,getThreads,getUsers})=>{

    const [mode,setMode] = useState('threads')
    const [cookies,setCookie,removeCookie]=useCookies()
    const {slug} = useParams()
    const user=users.filter(user=>user.handle===slug)[0]
    const [showEdit,setShowEdit]=useState(false)
    const leader = slug
    const follower = cookies.Handle
    const [isFollowed,setIsFollowed]=useState(true)
    const [endPoint,setEndPoint]=useState()
    const [reposts,setReposts]=useState()

    const checkFollow = async ()=>{
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/checkfollow`,{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({leader,follower})
        })
        const data = await response.json()
        setIsFollowed(data.isFollowed)
        setEndPoint(data.endPoint)

    }

    const getReposts = async ()=>{
        try{
            const response = await fetch (`${import.meta.env.VITE_SERVER_URL}/reposts`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({user_id:user.handle,follower:cookies.Handle})
            })
            if(response.status===200){
                const data = await response.json()
                setReposts(data)
            }
        }catch(e){
            console.error(e)
        }
    }

    const handleFollow = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${endPoint}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({leader,follower,filter:'follow'})
            })
            if(response.status===200){
                setIsFollowed(!isFollowed)
                isFollowed?setEndPoint('unfollow'):setEndPoint('follow')
                getThreads()
                getUsers()
                

            }

        }catch(error){
            console.error(error)
        }
    }

    
    useEffect(()=>{
        checkFollow()
    },[isFollowed])

    useEffect(()=>{
        getUsers().then(getThreads()).then(getReposts())
    },[mode,isFollowed,slug])

    
    return(
        <div className={'profile-page-container'}>
            <header>
                <InfoContainer>
                    <UserInfoContainer>
                        <h1>{user.username}</h1>
                        <p>@{user.handle} <span>threads.net</span></p>
                    </UserInfoContainer>
                    <ImageContainer>
                        <img src={user.img} alt={'avatar image'}/>
                    </ImageContainer>
                </InfoContainer>
                <p>{user.bio}</p>
                <SubInfoContainer>
                    <p style={{color: 'rgb(114, 114, 114)'}}>{user.follower_count} followers · <a href={user.link} target={'_blank'}>{user.link}</a>
                    </p>
                </SubInfoContainer>
                <div style={{textAlign:'center'}}>
                    {slug!==cookies.Handle&&<button className={'primary'} onClick={handleFollow}>{isFollowed? 'Unfollow':'Follow'}</button>}

                    {slug===cookies.Handle&&<button className={'primary'} onClick={()=>setShowEdit(true)} >Edit Profile</button>}
                </div>
                <ButtonContainer>
                    <button style={mode === 'threads' ? {
                        color: 'rgb(250,250,250)',
                        borderBottom: '1.5px solid rgb(250,250,250)'
                    } : {color: 'rgb(114, 114, 114)'}} onClick={() => setMode('threads')}>Threads
                    </button>
                    <button style={mode === 'replies' ? {
                        color: 'rgb(250,250,250)',
                        borderBottom: '1.5px solid rgb(250,250,250)'
                    } : {color: 'rgb(114, 114, 114)'}} onClick={() => setMode('replies')}>Replies
                    </button>
                    <button style={mode === 'reposts' ? {
                        color: 'rgb(250,250,250)',
                        borderBottom: '1.5px solid rgb(250,250,250)'
                    } : {color: 'rgb(114, 114, 114)'}} onClick={() => setMode('reposts')}>Reposts
                    </button>
                </ButtonContainer>
            </header>
            {showEdit&&<EditProfile getUsers={getUsers} user={user} showEdit={showEdit}  setShowEdit={setShowEdit}/>}
            <div>
                {mode === 'threads' ? threads?.filter(thread=>
                    thread.thread_from===slug).filter(thread=>thread.reply_to===null).length!==0?
                    <Feed getThreads={getThreads} users={users} threads={threads?.filter(thread=>thread.thread_from===slug).filter(thread=>thread.reply_to===null)}></Feed>:
                    <p style={{color:'rgb(104,104,104)',textAlign:'center'}}>No threads yet.</p>:mode==='replies'?
                    threads?.filter(thread=>thread.thread_from===slug).filter(thread=>thread.reply_to!==null).length!==0?
                        <div>
                            {threads?.filter(thread=>thread.thread_from===slug).filter(thread=>thread.reply_to!==null).map((t,index)=>
                                <div key={index}>
                                    {threads.filter(thread=>thread.id===t.reply_to)[0]?.reply_to && <p style={{color: 'rgb(104,104,104)',fontSize:'14px',fontStyle:'italic'}}>Replying to @
                                        {threads.filter(tr=>tr.id===threads.filter(thread=>thread.id===t.reply_to)[0]?.reply_to)[0]?.thread_from} :
                                    </p>}
                                    {threads.filter(thread=>thread.id===t.reply_to)[0]&&<>
                                        <Thread thread={threads.filter(thread => thread.id === t.reply_to)[0]}
                                                user={users.filter(u => u.handle === threads.filter(th => th.id === t.reply_to)[0].thread_from)}
                                                getThreads={getThreads}></Thread>

                                        <hr style={{
                                            transform: 'rotate(90deg) translate(-39px, 13px)',
                                            width: '75px',
                                            position: 'absolute'
                                        }}/></>}
                                    <Thread user={users.filter(u=>u.handle===t.thread_from)} thread={t} getThreads={getThreads}></Thread>
                                </div>
                            )}
                        </div>:
                        <p style={{color:'rgb(104,104,104)',textAlign:'center'}}>No replies yet.</p>:
                    reposts?.length!==0?
                    <div>
                        {reposts?.map(re=>
                            <div key={re.id}>
                                <p style={{color: 'rgb(104,104,104)',fontSize:'14px',fontStyle:'italic'}}>
                                    {user.handle} reposted :
                                </p>
                                <Thread thread={re} user={users.filter(u=>u.handle===re.thread_from)} getThreads={getThreads}></Thread>
                            </div>
                        )}
                    </div>:<p style={{color:'rgb(104,104,104)',textAlign:'center'}}>No reposts yet.</p>
                }
            </div>
        </div>
    )
}

export default Profile