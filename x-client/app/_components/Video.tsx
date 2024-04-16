export function Video({videoUrl}:{videoUrl:string}) {
    return (
      <video width="320" height="240" controls preload="none">
        <source src="/path/to/video.mp4" type="video/mp4" />
        <track
          src={videoUrl}
          kind="subtitles"
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>
    )
  }