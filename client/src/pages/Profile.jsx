import styled from "styled-components";
import {useEffect, useState} from "react";
import Feed from './../components/Feed.jsx'
import {useParams} from "react-router-dom";
import {useCookies} from "react-cookie";
import EditProfile from "../components/EditProfile.jsx";


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
const SubInfoContainer = styled.div`
  color: rgb(114,114,114);
  a{
    text-decoration: none;
    color: rgb(114,114,114);
  }
`
const ButtonContainer = styled.div`
    button{
        border: none;
        background-color: transparent;
        padding: 7px;
        color:rgb(114,114,114);
        border-bottom: 1px solid rgb(114,114,114);
        font-weight: bold;
        width: 50%;
        cursor: pointer;
        &:hover{
           color: rgb(90,90,90);
        }
    }
`



const Profile = ({users,threads,getThreads})=>{

    const [mode,setMode] = useState('threads')
    const [user,setUser]=useState([])
    const [cookies,setCookie,removeCookie]=useCookies()
    const [followers,setFollowers]=useState(0)
    const {slug} = useParams()
    const [showEdit,setShowEdit]=useState(false)
    const leader = slug
    const follower = cookies.Handle
    const [isFollowed,setIsFollowed]=useState(true)
    const [endPoint,setEndPoint]=useState()

    const checkFollow = async ()=>{
        const response = await fetch('http://localhost:8000/checkfollow',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({leader,follower})
        })
        const data = await response.json()
        setIsFollowed(data.isFollowed)
        setEndPoint(data.endPoint)

    }



    const getUserData = async()=>{
        const response  = await fetch(`http://localhost:8000/users/${slug}`)
        const data = await response.json()
        setUser(data.users[0])
    }

    const getFollowers = async()=>{
        const response  = await fetch(`http://localhost:8000/users/${slug}`)
        const data = await response.json()
        setFollowers(data.followers[0].count)
    }

    const handleFollow = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch(`http://localhost:8000/${endPoint}`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({leader,follower})
            })
            if(response.status===200){
                setIsFollowed(!isFollowed)
                isFollowed?setEndPoint('unfollow'):setEndPoint('follow')
                getFollowers()

            }

        }catch(error){
            console.error(error)
        }
    }


    useEffect( ()=>{
        getUserData()
    },[showEdit])
    
    useEffect(()=>{
        checkFollow()
        getFollowers()
    },[isFollowed])

    useEffect(()=>{
        getThreads()
    },[mode])

    
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
                    <p style={{color: 'rgb(114, 114, 114)'}}>{followers} followers · <a href={user.link} target={'_blank'}>{user.link}</a>
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
                </ButtonContainer>
            </header>
            {showEdit&&<EditProfile getUserData={getUserData} user={user} showEdit={showEdit}  setShowEdit={setShowEdit}/>}
            {mode === 'threads' ? <Feed users={users} threads={threads?.filter(thread=>thread.thread_from===slug)}></Feed>:<h1>Replies</h1>}
        </div>
    )
}

export default Profile