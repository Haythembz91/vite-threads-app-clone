import styled from "styled-components";
import {useEffect, useState} from "react";


const ThreadInputContainer = styled.div`
    position: absolute;
    top: 0px;
    color: rgb(250,250,250);
    background-color: #101010;
    width: 50%;
    border-radius: 20px ;
    padding: 20px;
    input{
        background-color: transparent;
        border: none;
        color: rgb(250,250,250);
        border-bottom: rgb(38,38,38) 1px solid;
        padding:10px;
        margin:10px 0;
        width: 100%;
        box-sizing: border-box;
        font-family: "Segoe UI",Arial,sans-serif;
        &:focus{
            outline: none;
        }
    }
  button{
    background-color: rgb(250,250,250);
    color: #101010;
    padding: 20px;
    font-size: 12px;
    border-radius: 20px;
  }
  @media (max-width: 720px){
    width: 80%;
    height: 100svh;
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
        border-radius: 10px;
        &:hover{
            background-color: rgb(40,40,40);
        }
    }
`
const EditProfile = ({setShowEdit,user,getUsers,showEdit})=>{


    const [name,setName]=useState(user.username)
    const [avatar,setAvatar]=useState(user.img)
    const [bio,setBio]=useState(user.bio)
    const [link,setLink]=useState(user.link)
    const [inst,setInst]=useState(user.inst_url)
    const handle = user.handle

    const handleEdit = async (e)=>{
        e.preventDefault()
        try{
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/edit`,{
                method:'PUT',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({name,avatar,bio,link,inst,handle})
            })
            
            if (response.status===200){
                setShowEdit(false)
                getUsers()
            }
        }catch(error){
            console.error(error)
        }
    }

    useEffect(()=>{
        getUsers()
    },[showEdit])
    

    return (
        <ThreadInputContainer>
            <CloseButton>
                <svg onClick={()=>setShowEdit(false)} clipRule="evenodd" fillRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                        fillRule="nonzero"/>
                </svg>
            </CloseButton>
            <form>
                <label>Name</label>
                <input type={'text'} value={name} onChange={e=>setName(e.target.value)}/>
                <label>Avatar</label>
                <input type={'text'} value={avatar} onChange={e=>setAvatar(e.target.value)}/>
                <label>Bio</label>
                <input type={'text'} value={bio} onChange={e=>setBio(e.target.value)}/>
                <label>Link</label>
                <input type={'text'} value={link} onChange={e=>setLink(e.target.value)}/>
                <label>Instagram URL</label>
                <input type={'text'} value={inst} onChange={e=>setInst(e.target.value)}/>
            </form>
            <button style={{width:'100%'}} className={'primary'} onClick={(e)=>handleEdit(e)}>Done</button>
        </ThreadInputContainer>
    )
}

export default EditProfile