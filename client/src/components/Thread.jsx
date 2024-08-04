import styled from "styled-components";
import {Link} from 'react-router-dom'
import {ImageContainer} from "../pages/Profile.jsx";
import { Cookies, useCookies } from "react-cookie";
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import ReplyLoader from "./ReplyLoader.jsx";



const FeedCard = styled.article`
    border-bottom: 1px solid rgb(114,114,114);
    font-family: "Segoe UI Semibold",Arial,sans-serif;
    padding: 10px 0;
    position: relative;
    span{
        color:rgb(114,114,114);
    }
`
export const TextContainer = styled.div`
    display: flex;
    svg{
      padding: 5px;
      border-radius: 50%;
      &:hover {
        background-color: #151515;
      }
    }
`
export const Img = styled(ImageContainer)`
    width: 40px;
    height: 40px;
`
const Icons=styled.div`
  width: 40%;

  svg {
    width: 20px;
    padding: 0 6px;
  }

  display: flex;

  div {
    display: flex;
    padding: 5px 10px;
    border-radius: 10px;

    &:hover {
      background-color: #151515;
    }
  }

`
const ReplyInput = styled.div`
    input{
        background-color: transparent;
        border: none;
        color: white;
        &:focus{
            outline: none;
        }
    }
`
const MoreModal = styled.div`
        cursor: pointer;
        .menuModal{
          position: absolute;
          right: 0;
          top: 30px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          span{
            color:rgb(229, 224, 224);
            padding: 7px;
            &:hover{
              background-color: #151515 ;
            }
          }
          border: solid 1px rgb(114,114,114) ;
          border-radius: 15px;
        }
        
        
        .svgBtn{
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          justify-content: flex-end;
          border-radius: 50%;
          padding: 7px;
          &:hover {
            background-color: #151515;
          }
        }
`



const Thread =({user,thread,getThreads})=>{

    const [cookies,setCookie,removeCookie]=useCookies()
    const [likes,setLikes]=useState(0)
    const [isLiked,setIsLiked]=useState(false)
    const [endPoint,setEndPoint]=useState()
    const [reply,setReply]=useState('')
    const [replies,setReplies]=useState(0)
    const {thread_id}=useParams()
    const [showReplyInput,setShowReplyInput]=useState(false)
    const [showPosting,setShowPosting]=useState(false)
    const [showPosted,setShowPosted]=useState(false)
    const [showMenu,setShowMenu]=useState(false)
    const likesCount = async ()=>{
        try{
            const response = await fetch('http://localhost:8000/likes',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,userId:cookies.Handle})
            })
            const data = await response.json()
            setReplies(data.replies[0].count)
            setLikes(data.likes[0].count)
            setIsLiked(data.isLiked)
            setEndPoint(data.endPoint)
        }catch(error){console.error(error)}
    }
    const handleLike = async ()=>{
        try{
            const response = await fetch(`http://localhost:8000/${endPoint}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,userId:cookies.Handle,recipient:thread.thread_from})
            })
            const data = await response.json()
            if(response.status===200){
                setIsLiked(!isLiked)
                isLiked?setEndPoint('unlike'):setEndPoint('like')
                likesCount()
            }
        }catch(error){console.error(error)}
    }

    const handleReply = async (e)=> {
        e.preventDefault();
        setShowPosting(true)
        try {
            const response = await fetch('http://localhost:8000/reply',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,poster:cookies.Handle,threadFrom:thread.thread_from,text:reply,time:new Date()})
            })
            if (response.status===200){
                setReply('')
                likesCount()
                getThreads()
            }
        }
        catch (error){
            console.error(error)
        }finally {
            setShowPosting(false)
            setShowPosted(true)
            setTimeout(()=>setShowPosted(false),1500)
        }
    }

    const handleEdit=()=>{

    }

    const handleSave=()=>{

    }
    const handleDelete=async ()=>{
        try{
            const response = await fetch('http://localhost:8000/delete',{
                method:'DELETE',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({thread_id:thread.id})
            })
            if(response.status===200){
                getThreads()
            }
        }catch(error){
            console.error(error)
        }

    }

    const time = Math.ceil((new Date()- new Date(thread.time_stamp))/1000)

    const timeStamp = ()=>{
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
            default : {
                return thread.time_stamp.slice(0,10)
                break
            }
        }
    }

    useEffect(()=>{
        likesCount()
        getThreads()
    },[likes,replies,thread_id])



    return (
        <FeedCard>
            <Link key={thread.id} to={`/${thread.thread_from}/post/${thread.id}`}>
                <TextContainer>
                    <Link to={`/users/${thread.thread_from}`}>
                        <Img><img src={user[0].img} alt={'avatar image'}/></Img>
                    </Link>
                    <div>
                        <div style={{display: 'flex'}}>
                            <Link to={`/users/${thread.thread_from}`}><p style={{fontWeight:'600'}}>{thread.thread_from}</p>
                            </Link>
                            <p style={{color: 'rgb(114,114,114)'}}>{timeStamp()}</p>
                            </div>
                        <p style={{fontWeight:'400',fontFamily:'Segoe UI,arial'}}>{thread.text}</p>
                    </div>
                </TextContainer>
            </Link>
            <MoreModal>
                <div className={'svgBtn'} onClick={()=>setShowMenu(!showMenu)} >
                    <svg style={{fill:'rgb(114,114,114)'}}  width={'24px'} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m16.5 11.995c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25z"/></svg>
                </div>
                {showMenu&&<div className={'menuModal'}>
                    {cookies.Handle===thread.thread_from&&<>
                        <span onClick={handleEdit}>Edit post</span>
                        <span onClick={handleDelete}>Delete post</span>
                    </>}
                    <span onClick={handleSave}>Save post</span>
                </div>}
            </MoreModal>
            <Icons>
                <div>
                    <svg style={isLiked ? {fill: '#ff0034'} : {fill: 'transparent',stroke:'grey'}} onClick={handleLike} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 5.72c-2.624-4.517-10-3.198-10 2.461 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-5.678-7.396-6.944-10-2.461z" fillRule="nonzero"/>
                    </svg>
                    <span style={isLiked?{color:'#ff0034'}:{color:'grey'}}>{likes}</span>
                </div>
                <div>
                    <svg onClick={()=>{setShowReplyInput(true)}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                            d="M12 3c5.514 0 10 3.476 10 7.747 0 4.272-4.48 7.748-9.986 7.748-.62 0-1.092-.046-1.759-.097-1 .776-1.774 1.403-3.485 1.962.26-1.383-.113-2.259-.514-3.259-2.383-1.505-4.256-3.411-4.256-6.354 0-4.271 4.486-7.747 10-7.747zm0-2c-6.627 0-12 4.363-12 9.747 0 3.13 1.816 5.916 4.641 7.699.867 2.167-1.084 4.008-3.143 4.502 3.085.266 6.776-.481 9.374-2.497 7.08.54 13.128-3.988 13.128-9.704 0-5.384-5.373-9.747-12-9.747z"/>
                    </svg>
                    <span>{replies}</span>
                </div>
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24"  height="24" viewBox="0 0 24 24">
                        <path
                            d="M5 10v7h10.797l1.594 2h-14.391v-9h-3l4-5 4 5h-3zm14 4v-7h-10.797l-1.594-2h14.391v9h3l-4 5-4-5h3z"/>
                    </svg>
                </div>
            </Icons>
            {showReplyInput&&<ReplyInput>
                <form style={{position:'relative'}} onSubmit={reply!==''?handleReply:(e)=>{e.preventDefault()}}>
                    <input autoFocus={true} value={reply} style={{paddingLeft: '10px'}} type={'text'}
                           placeholder={`Reply to ${user[0].handle}...`} onChange={e => setReply(e.target.value)}/>
                    <input type={'submit'} value={'Post'} className={'postBtn'} onSubmit={reply!==''?handleReply:(e)=>{e.preventDefault()}} />
                    {showPosting?<ReplyLoader showPosted={showPosted} showPosting={showPosting}></ReplyLoader>:
                    showPosted&&<ReplyLoader showPosted={showPosted} showPosting={showPosting}></ReplyLoader>}
                </form>
            </ReplyInput>}
        </FeedCard>

    )
}

export default Thread