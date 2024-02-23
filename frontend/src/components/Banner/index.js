function Banner({ url, onClick = () => {} }) {
  return (
    <>
      {url ? 
        <div 
          className="absolute w-full h-48 bg-cover bg-center" 
          style={{backgroundImage: `url(${url})`}}
          onClick={onClick}
        ></div>
        :
        <div 
          className="absolute w-full h-48 bg-cover bg-center" 
          style={{backgroundImage: "url('https://source.unsplash.com/random')"}}
          onClick={onClick}
        ></div>
      }
    </>
  );
}

export default Banner;