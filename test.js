import createVideoPlayer, {AudioOutput, VideoOutput} from "./index";

const videoPlayer = createVideoPlayer({
    display: VideoOutput.HDMI0,
    audio: AudioOutput.jack
});
videoPlayer.open({
    source: 'test.mp4',
    audio: AudioOutput.HDMI,
    osd: true
});