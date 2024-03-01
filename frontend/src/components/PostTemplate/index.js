import React from 'react';
import AvatarDropdown from '../AvatarDropdown';
import PopUpImage from '../PopUpImage';
import HeartPost from '../HeartPost';
import Reply from '../Reply';
import PostOptions from '../PostOptions';

function PostTemplate ({ posts, Likes}) {
  const username = localStorage.getItem('username');
  return (
    <div className="flex flex-col">
        
        {posts.map((post, postIndex) => (
            <div key={postIndex}  className="w-11/12 rounded-xl bg-white p-5 my-4 shadow-md">
                <div className="flex justify-between gap-4 items-center">
                <div className="flex gap-4 items-center">
                    <AvatarDropdown username={post.author} avatar={post.profile_picture} className="absolute z-10"/>
                    <h2 className="text-2xl font-bold">{post.author}</h2>
                    {post.parent_id && post.parent ? <p>replying to <a href={`/${post.parent}/status/${post.parent_id}`}><strong>@{post.parent}</strong></a></p> : null}
                    <p>{post.date_posted}</p>
                </div>
                {post.author === username ? <PostOptions postId={post.id}/> : null}
                </div>
                <a href={`/${post.author}/status/${post.id}`}>
                <p className="mt-2 pb-2 pt-2 whitespace-pre-wrap">{post.content}</p>
                {post.images.length > 1 ? 
                <div className="grid grid-cols-2 gap-2 max-w-3xl" onClick={(event) => event.preventDefault()}>
                    {post.images.map((image, imageIndex) => (
                    <div key={imageIndex} className="grid gap-4">
                            <PopUpImage image={image}/>
                            </div>
                        ))}
                    </div>
                    : 
                    <div className="grid grid-cols-1 gap-2 max-w-2xl" onClick={(event) => event.preventDefault()}>
                    {post.images.map((image, imageIndex) => (
                        <div key={imageIndex} className="grid gap-4">
                        <PopUpImage image={image}/>
                        </div>
                    ))}
                    </div>
                }
                
                </a>
                <div className="flex gap-4 mt-1">
                    <HeartPost postId={post.id} Liked={Likes[post.id]?.isLiked} likesCount={Likes[post.id]?.totalLikes} />
                    <Reply postId={post.id} numComments={post.comments.length}/>
                </div>
            </div>
        ))}  
        </div>
  )
}

export default PostTemplate;