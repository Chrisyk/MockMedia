import React from 'react';
import AvatarDropdown from '../AvatarDropdown';
import PopUpImage from '../PopUpImage';
import HeartPost from '../HeartPost';
import Reply from '../Reply';
import PostOptions from '../PostOptions';
import './index.scss';

function PostTemplate ({ posts, Likes}) {
  const username = localStorage.getItem('username');
  return (
    <div className="flex flex-col">
        
        {posts.map((post, postIndex) => (
            <div key={postIndex}  className="post w-full rounded-xl bg-white p-5 my-4 shadow-md">
                <div className="flex justify-between gap-4 items-center">
                <div className="flex gap-4 items-center">
                    <AvatarDropdown username={post.author} avatar={post.profile_picture} className="absolute z-10"/>
                    <h2 className="text-2xl font-bold mt-1">{post.author}</h2>
                    {post.parent_id && post.parent ? <p className="mt-2">replying to <a href={`/${post.parent}/status/${post.parent_id}`}><strong>@{post.parent}</strong></a></p> : null}
                    <p className='date mt-2'>{post.date_posted}</p>
                </div>
                {post.author === username ? <PostOptions postId={post.id}/> : null}
                </div>
                <a href={`/${post.author}/status/${post.id}`}>
                <p className="content mt-2 pb-4 pt-2 whitespace-pre-wrap">{post.content}</p>
                {post.images.length > 1 ? 
                <div className="image grid grid-cols-2 gap-2" onClick={(event) => event.preventDefault()}>
                    {post.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="grid gap-4">
                            <PopUpImage image={image}/>
                            </div>
                        ))}
                    </div>
                    : 
                    <div className="image grid grid-cols-1 gap-2" onClick={(event) => event.preventDefault()}>
                    {post.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="grid gap-4">
                        <PopUpImage image={image}/>
                        </div>
                    ))}
                    </div>
                }
                
                </a>
                <div className="likes-comments flex gap-4 mt-3">
                    <HeartPost postId={post.id} Liked={Likes[post.id]?.isLiked} likesCount={Likes[post.id]?.totalLikes} />
                    <Reply postId={post.id} numComments={post.comments.length}/>
                </div>
            </div>
        ))}  
        </div>
  )
}

export default PostTemplate;