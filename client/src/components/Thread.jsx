import styled from "styled-components";
import {Link} from 'react-router-dom'
import {ImageContainer} from "../pages/Profile.jsx";
import { Cookies, useCookies } from "react-cookie";
import {useEffect, useState} from "react";
import {useParams} from 'react-router-dom'
import ReplyLoader from "./ReplyLoader.jsx";



const FeedCard = styled.article`
    font-family: "Segoe UI Semibold",Arial,sans-serif;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    span{
        color:rgb(114,114,114);
    }
  .svgBtn{
    display: flex;
    justify-content: flex-end;
    border-radius: 50%;
    padding: 7px;
    &:hover {
      background-color: #151515;
    }
  }
  @media (max-width: 720px){
    padding: 10px;
  }
`
export const TextContainer = styled.div`
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
    margin: 5px;
`
const Icons=styled.div`
  padding-bottom: 7px;
  
  svg {
    width: 20px;
    padding: 0 6px;
  }
  display: flex;
  padding-top: 10px;
  div {
    display: flex;
    padding-right: 7px;
    border-radius: 10px;
    transition:background-color 0.2s linear;
    &:hover {
      background-color: #151515;
    }
  }
`
const ReplyInput = styled.div`
    padding-top: 5px;
    form{
      display:flex;
      justify-content:space-between;
    }
    input{
        background-color: transparent;
        border: none;
        color: white;
        padding: 7px;
        &:focus{
            outline: none;
        }
    }
    div{
      display: flex;
    }
`
const EditInput = styled(ReplyInput)`
    input{
    width: 100%;
    }
    
`

const MoreModal = styled.div`
        cursor: pointer;
        display: flex;
        justify-content: right;
        .menuModal{
          position: absolute;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          span{
            color:rgb(229, 224, 224);
            padding: 7px;
            transition:background-color 0.2s linear;
            &:hover{
              background-color: #151515 ;
            }
          }
          border: solid 1px rgb(114,114,114) ;
          border-radius: 15px;
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
    const [isSaved,setIsSaved]=useState(false)
    const [showSaving,setShowSaving]=useState(false)
    const [showDeleting,setShowDeleting]=useState(false)
    const [showSaved,setShowSaved]=useState(false)
    const [showDeleted,setShowDeleted]=useState(false)
    const [showUnsaving,setShowUnsaving]=useState(false)
    const [showUnsaved,setShowUnsaved]=useState(false)
    const [showEdit,setShowEdit]=useState(false)
    const [edit,setEdit]=useState(thread.text)
    const [isReposted,setIsReposted]=useState(false)
    const [repost,setRepost]=useState()

    const likesCount = async ()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/likes`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,userId:cookies.Handle,poster:thread.thread_from})
            })
            const data = await response.json()
            setReplies(data.replies[0].count)
            setLikes(data.likes[0].count)
            setIsLiked(data.isLiked)
            setEndPoint(data.endPoint)
            setIsSaved(data.isSaved)
            setIsReposted(data.isReposted)
            setRepost(data.reposts)
        }catch(error)
        {console.error(error)}
    }
    const handleLike = async ()=>{
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${endPoint}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,userId:cookies.Handle,recipient:thread.thread_from,filter:'threads'})
            })
            if(response.status===200){
                setIsLiked(!isLiked)
                isLiked?setEndPoint('unlike'):setEndPoint('like')
                getThreads().then(likesCount())
            }
        }catch(error){console.error(error)}
    }

    const handleReply = async (e)=> {
        e.preventDefault()
        setShowPosting(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/reply`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,poster:cookies.Handle,threadFrom:thread.thread_from,text:reply,time:new Date()})
            })
            if (response.status===200){
                setReply('')
                getThreads().then(likesCount())
                setShowReplyInput(false)
            }
        }
        catch (error){
            console.error(error)
        }finally {
            setShowPosting(false)
            setShowPosted(true)
            setTimeout(()=>setShowPosted(false),2000)
        }
    }

    const handleEdit = async (e)=>{
        e.preventDefault()
        setShowPosting(true)
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/editpost`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({text:edit,thread_id:thread.id})
            })
            if(response.status===200){
                setShowEdit(false)
                getThreads().then(likesCount())

            }
        }catch (e) {
            console.error(e)
        }finally {
            setShowPosting(false)
            setShowPosted(true)
            setTimeout(()=>setShowPosted(false),2000)
        }
    }

    const handleSave = async ()=>{
        setShowMenu(false)
        isSaved?setShowUnsaving(true):setShowSaving(true)
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${isSaved?'unsave':'save'}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({threadId:thread.id,poster:cookies.Handle,threadFrom:thread.thread_from,time:new Date(),filter:'save'})
            })
            if(response.status===200){
                getThreads().then(likesCount())
            }
        }catch(e){
            console.error(e)
        }finally {
            if(!isSaved){
                setShowSaving(false)
                setShowSaved(true)
                setTimeout(()=>{setShowSaved(false)},2000)
            }else{
                setShowUnsaving(false)
                setShowUnsaved(true)
                setTimeout(()=>{setShowUnsaved(false)},2000)
            }

        }


    }
    const handleDelete=async (e)=>{
        e.preventDefault();
        setShowDeleting(true)
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/delete`,{
                method:'DELETE',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify({thread_id:thread.id})
            })
            if(response.status===200){
                getThreads().then(likesCount())
            }
        }catch(error){
            console.error(error)
        }finally {
            setShowDeleting(false)
            setShowDeleted(true)
            setTimeout(()=>setShowDeleted(false),2000)
        }

    }

    const handleRepost = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/${isReposted?'removerepost':'repost'}`,{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({thread_id:thread.id,poster_id:thread.thread_from,user_id:cookies.Handle})
            })
            if(response.status===200){
                getThreads().then(likesCount())
            }
        }catch(e){
            console.error(e)
        }
    }

    const time = Math.floor((new Date()- new Date(thread.time_stamp))/1000)

    const timeStamp = ()=>{
        switch (true){
            case time <60: {
                return time + 's'
                break
            }
            case time <3600: {
                return Math.floor(time/60) + 'm'
                break
            }
            case (time/3600)<23:{
                return Math.floor(time/3600) + 'h'
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
        getThreads().then(likesCount())
    },[likes,replies,thread_id,showMenu])


    return (
        <FeedCard>
            <div style={{display:'flex',justifyContent:'space-between'}}>
                <div style={{display:'flex',width:'100%'}}>
                    <div>
                        <Link to={`/users/${thread.thread_from}`}>
                            <Img><img src={user[0].img} alt={'avatar image'}/></Img>
                        </Link>
                    </div>
                    <div style={{display:'flex',flexDirection:'column',width:'100%',borderBottom: '1px solid rgb(114,114,114)'}}>
                        <Link to={`/${thread.thread_from}/post/${thread.id}`}>
                            <div>
                                <div style={{display: 'flex'}}>
                                    <Link to={`/users/${thread.thread_from}`}><p style={{fontWeight:'600'}}>{thread.thread_from}</p>
                                    </Link>
                                    <p style={{color: 'rgb(114,114,114)'}}>{timeStamp()}</p>
                                </div>

                            </div>
                        </Link>
                        <div>
                            {showEdit?<EditInput>
                                <form>
                                    <div>
                                        <input autoFocus={true} value={edit} type={'text'}
                                               onChange={e => setEdit(e.target.value)}/>
                                    </div>
                                    <div>
                                        <input type={'submit'} value={'Cancel'} className={'postBtn'} onClick={()=> {
                                            setShowEdit(false);
                                            setEdit(thread.text);
                                        }}/>
                                        <input type={'submit'} value={'Post'} className={'postBtn'} onClick={edit!==''?handleEdit:(e)=>{e.preventDefault()}} />
                                    </div>
                                </form>
                            </EditInput>:<Link to={`/${thread.thread_from}/post/${thread.id}`}><p style={{fontWeight:'400',fontFamily:'Segoe UI,arial',paddingTop:'7px'}}>{thread.text}</p></Link>}
                        </div>
                        <Icons>
                            <div>
                                <svg style={isLiked ? {fill: '#ff0034'} : {fill: 'grey'}} onClick={handleLike} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12 5.72c-2.624-4.517-10-3.198-10 2.461 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-5.678-7.396-6.944-10-2.461z" fillRule="nonzero"/>
                                </svg>
                                <span style={isLiked?{color:'#ff0034'}:{color:'grey'}}>{likes}</span>
                            </div>
                            <div>
                                <svg style={{fill:'grey'}} onClick={()=>{setShowReplyInput(true)}} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M12 3c5.514 0 10 3.476 10 7.747 0 4.272-4.48 7.748-9.986 7.748-.62 0-1.092-.046-1.759-.097-1 .776-1.774 1.403-3.485 1.962.26-1.383-.113-2.259-.514-3.259-2.383-1.505-4.256-3.411-4.256-6.354 0-4.271 4.486-7.747 10-7.747zm0-2c-6.627 0-12 4.363-12 9.747 0 3.13 1.816 5.916 4.641 7.699.867 2.167-1.084 4.008-3.143 4.502 3.085.266 6.776-.481 9.374-2.497 7.08.54 13.128-3.988 13.128-9.704 0-5.384-5.373-9.747-12-9.747z"/>
                                </svg>
                                <span>{replies}</span>
                            </div>
                            <div>
                                <svg style={isReposted ? {fill: '#ff0034'} : {fill: 'grey'}} onClick={handleRepost} xmlns="http://www.w3.org/2000/svg" width="24"  height="24" viewBox="0 0 24 24">
                                    <path
                                        d="M5 10v7h10.797l1.594 2h-14.391v-9h-3l4-5 4 5h-3zm14 4v-7h-10.797l-1.594-2h14.391v9h3l-4 5-4-5h3z"/>
                                </svg>
                                <span style={isReposted?{color:'#ff0034'}:{color:'grey'}}>{repost}</span>
                            </div>
                        </Icons>
                    </div>
                </div>
                <div style={{borderBottom: '1px solid rgb(114,114,114)'}}>
                    <div className={'svgBtn'} onClick={()=>setShowMenu(!showMenu)} >
                        <svg style={{fill:'rgb(114,114,114)'}}  width={'24px'} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m16.5 11.995c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25zm-6.75 0c0-1.242 1.008-2.25 2.25-2.25s2.25 1.008 2.25 2.25-1.008 2.25-2.25 2.25-2.25-1.008-2.25-2.25z"/></svg>
                    </div>
                    {showMenu&&<MoreModal>
                        <div className={'menuModal'}>
                            {cookies.Handle === thread.thread_from && <>
                        <span onClick={() => {
                            setShowEdit(true);
                            setShowMenu(false);
                        }}>Edit post</span>
                                <span onClick={handleDelete}>Delete post</span>
                            </>}
                            {cookies.Handle !== thread.thread_from &&
                                <span onClick={handleSave}>{isSaved ? 'Unsave post' : 'Save post'}</span>}
                        </div>
                    </MoreModal>}
                </div>
            </div>
            <div>
                {showReplyInput&&<ReplyInput>
                    <form onSubmit={reply!==''?handleReply:(e)=>{e.preventDefault()}}>
                        <input autoFocus={true} value={reply} style={{paddingLeft: '10px'}} type={'text'}
                               placeholder={`Reply to ${user[0].handle}...`} onChange={e => setReply(e.target.value)}/>
                        <input type={'submit'} value={'Post'} className={'postBtn'} onSubmit={reply!==''?handleReply:(e)=>{e.preventDefault()}} />
                    </form>
                </ReplyInput>}
                <ReplyLoader showUnsaving={showUnsaving} showUnsaved={showUnsaved} showSaving={showSaving} showSaved={showSaved} showDeleting={showDeleting} showDeleted={showDeleted} showPosting={showPosting} showPosted={showPosted}></ReplyLoader>
            </div>
        </FeedCard>
    )
}

export default Thread