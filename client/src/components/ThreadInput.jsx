import styled from "styled-components";
import {TextContainer,Img} from './Thread.jsx'
import {useEffect, useState} from "react";



const ThreadInputContainer = styled.div`
    background-color: rgb(38,38,38);
    width: 50%;
    height: 250px;
    border-radius: 20px ;
    padding: 20px;
    input{
        background-color: transparent;
        border: none;
        padding:10px;
        margin:10px 0;
        width: 100%;
        box-sizing: border-box;
        border-radius: 10px;
        color: rgb(250,250,250);
        &:focus{
            outline: none;
        }
    }
  @media (max-width: 720px){
    width: 80%;
    height: fit-content;
  }
`

const CloseButton = styled.div`
    position: relative;
    svg{
        position: absolute;
        right: 0;
        fill: #4b4c4f;
        width: 30px;
        padding: 10px;
        border-radius: 15px;
        &:hover{
            background-color: rgb(40,40,40);
        }
    }
`
const ThreadInput = ({setShowModal,user,getThreads,showModal})=>{

    const poster = user.handle
    const [thread,setThread] = useState('')
    const time = new Date()

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/post`,{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body:JSON.stringify({poster,thread,time})
            })
            if (response.status===200){
                setShowModal(false)
                getThreads()
            }
        }catch(error){console.error(error)}
    }

    useEffect(()=>{
        getThreads()
    },[showModal])

    return (
        <ThreadInputContainer>
            <CloseButton>
                <svg onClick={()=>{setShowModal(false)}} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                        fillRule="nonzero"/>
                </svg>
            </CloseButton>
            <TextContainer>
                <div style={{display:'flex'}}>
                    <Img>
                        <img src={user.img} alt={'avatar image'}/>
                    </Img>
                    <p><strong>{user.handle}</strong></p>
                </div>
            </TextContainer>
            <input autoFocus type={'text'} onChange={e=>setThread(e.target.value)} placeholder={'Start a thread...'}/>
            <button style={{width:'100%'}} className={'primary'} onClick={thread!==''?handleSubmit:()=>{}}>Post</button>
        </ThreadInputContainer>
    )
}

export default ThreadInput