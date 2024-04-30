import Feed from './../components/Feed.jsx'



const Home = ({user,threads})=>{
    return (
        <div>
            <Feed user={user} threads={threads}></Feed>
        </div>

    )
}

export default Home