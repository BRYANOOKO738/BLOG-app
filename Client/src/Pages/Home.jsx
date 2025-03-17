import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
import CallToAction from '../Components/CallToAction';
import PostCard from '../Components/PostCard';

const Home = () => {
  const [posts, setposts] = useState([])
  useEffect(() => {
    try {
      const fetchpost = async () => {
        const res = await fetch(
          "http://localhost:3000/routes/Publish/getpost?limit=8"
        );
        const data = await res.json()
        if (res.ok) {
          setposts(data.posts)
        } 
      }
      fetchpost()
    } catch (error) {
      console.log(error.message)
    }
  }, [])
  
  return (
    <div>
      <div className="text-center mx-5 pt-4">
        <h2>
          <strong>Welcome to To UnboundVoices</strong>
        </h2>
        <p className="text-secondary">
          <strong>
            Welcome to our platform, where freedom of speech is valued and
            encouraged. Here, you can express your thoughts, share your
            opinions, and engage in open discussions without fear of censorship.
            We believe in fostering a respectful and inclusive community, where
            every voice is heard and diverse perspectives are embraced. 
          </strong>
        </p>
        <Link to={"/"} className="text-decoration-none self-center fw-4">
          View Allpost
        </Link>
      </div>
      <div className="m-5 dark:bg-dark">
        <CallToAction />
      </div>
      <div className="mx-auto row gap-2">
        {posts && posts.length > 0 && (
          <div className="row">
            <h2 className="text-center col-12">Recent Posts</h2>
            {posts.map((post) => (
              <div key={post.id} className="col-12 col-md-6 col-lg-4">
                <PostCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home