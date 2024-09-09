import ThreadInput from './ThreadInput.jsx'


const PopUp = ({setShowModal,user,getThreads,showModal})=>{
    return(
        <div className={'popUp'}>
            <ThreadInput showModal={showModal} getThreads={getThreads} user={user} setShowModal={setShowModal}></ThreadInput>
        </div>
    )
}

export default PopUp