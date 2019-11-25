# omxplayer-node

A library for controlling the Raspberry Pi [omxplayer](https://github.com/popcornmix/omxplayer) from Node.js, now
 also supporting multiple displays, yay!

## Get Started

```js
// Import the module.
import createVideoPlayer, { AudioOutput, VideoOutput } from 'omxplayer-node';

// Create an instance of the player with some global params set
const videoPlayer = createVideoPlayer({
    display: VideoOutput.HDMI0,
    audio: AudioOutput.jack,
});

// Open a file and set s'more params (these take precedency over the global ones)
videoPlayer.open({
    source: 'test.mp4',
    audio: AudioOutput.HDMI,
    osd: true
});

// Control video/audio playback.
player.pause();
player.volUp();
player.quit();
```

**Warning**: If you quit node before quitting the player, there is a chance of a zombie process being created, which will persist until the current audio/video track ends.

## Installation

```
npm install omxplayer-node
```

This module does not require any third party Node.js libraries, but does rely on omxplayer being installed. On the default version of Raspbian it is installed by default, but on the Lite version you will have to install it:

```
sudo apt-get install omxplayer
```

## API

### createVideoPlayer(params = {})
*createVideoPlayer(globalParams: {audio?: AudioOutput, display?: VideoOutput, loop?: Boolean, initialVolume?: Number, osd?: Boolean}) => NodeOmxPlayerStatic*

This will initialize the player with some global parameters, so you don't have to set them every time you want to
 play a file.
 
- `audio` (optional): The audio output, if left blank will default to AudioOutput.jack, can be one of:
    + `AudioOutput.jack` - the analog output (3.5mm jack)
    + `AudioOutput.HDMI` - the HDMI port audio output
    + `AudioOutput.both` - both of the above outputs
    + `AudioOutput.alsa` - use Alsa settings
    
- `display` (optional): The video output, if left blank will default to primary display, can be one of:
    + `AudioOutput.HDMI0` - the first HDMI port
    + `AudioOutput.HDMI1` - the second HDMI port
    + `AudioOutput.LCD` - the 7" LCD panel for RPi
    
- `loop` (optional): Loop state, if set to true, will loop file if it is seekable. If left blank will default to false.

    **Warning**: As stated above, if you quit node before quitting the player, a zombie process may be created. 
    If this occurs when the loop option is in place, the `omxplayer` process may run indefinitely.

- `initialVolume` (optional): The initial volume, omxplayer will start with this value (in millibels). If left blank will default to 0.

- `osd` (optional): Whether to show OSD on top. Defaults to false.

**After getting the player object like so: `const player = createVideoPlayer(params)`, use the methods below to control
 the playback:**

### player.open(params)
*player.open(params: {source: string, audio?: AudioOutput, display?:VideoOutput, loop?: Boolean, initialVolume?: Number
, osd?: Boolean})*

Starts playback of a new source, the arguments are identical to those of the `createVideoPlayer` function
 described above with addition of the required `source` parameter. If a file is currently playing, ends this playback
  and begins playing the new source.

### player.play()

Resumes playback.

### player.pause()

Pauses playback.

### player.volUp()

Increases the volume.

### player.volDown()

Decreases the volume.

### player.fastFwd()

Fast forwards playback.

### player.rewind()

Rewinds playback.

### player.fwd30()

Skips playback forward by 30 seconds.

### player.back30()

Skips playback backward by 30 seconds.

### player.fwd600()

Skips playback forward by 600 seconds.

### player.back600()

Skips playback backward by 600 seconds.

### player.quit()

Quits the player.

### player.subtitles()

Toggle subtitles.

### player.info()

Provides info on the currently playing file.

### player.incSpeed()

Increases playback speed.

### player.decSpeed()

Decreases playback speed.

### player.prevChapter()

Skips to previous chapter.

### player.nextChapter()

Skips to next chapter.

### player.prevAudio()

Skips to previous audio stream.

### player.nextAudio()

Skips to next audio stream.

### player.prevSubtitle()

Skips to previous subtitle stream.

### player.nextSubtitle()

Skips to next subtitle stream.

### player.decSubDelay()

Decrease subtitle delay by 250ms.

### player.incSubDelay()

Increase subtitle delay by 250ms.

### player.running

Boolean giving the playback status, `true` if the player is still active, `false` if it has ended or the player has quit.

## Events

### 'close'

Fired when playback has finished.

### 'error'

Occurs when there is a problem with omxplayer. Includes a message with more information about the error.

## Errors

### 'Output <foo> not allowed.'

Incorrect audio output type passed to the player, see `createVideoPlayer` in the API section above. Can occur when
 creating the player or using the `player.open` method.

### 'Player is closed.'

An attempt has been made to send a command to the player after it has closed. Prevent this from happening by checking
 if it is still running using the `running` getter method. Can occur for any of the player methods except `open`.
