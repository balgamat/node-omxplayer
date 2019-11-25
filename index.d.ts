export declare const createVideoPlayer: NodeOmxPlayerStatic;
export declare const AudioOutput: {
  HDMI: 'hdmi',
  jack: 'local',
  both: 'both',
  alsa: 'alsa'
};
export declare const VideoOutput: {
  HDMI0: 2,
  HDMI1: 7,
  LCD: 4,
};

export default createVideoPlayer;


interface PlayerParams {audio?: String, display?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7, loop?: Boolean, initialVolume?: Number, osd?: Boolean}

export declare interface NodeOmxPlayerStatic {
	(globalParams: PlayerParams): NodeOmxPlayer;
}

export declare interface NodeOmxPlayer extends Event {
	open(params: {source: String} & PlayerParams): void;

	/**
	 * Resumes playback.
	 */
	play(): void;

	/**
	 * Pauses playback.
	 */
	pause(): void;

	/** 
	 * Increases the volume.
	 */
	volUp(): void;

	/**
	 * Decreases the volume.
	 */
	volDown(): void;

	/**
	 * Fast forwards playback.
	 */
	fastFwd(): void;

	/**
	 * Rewinds playback.
	 */
	rewind(): void;

	/**
	 * Skips playback forward by 30 seconds.
	 */
	fwd30(): void;

	/**
	 * Skips playback backward by 30 seconds.
	 */
	back30(): void;

	/**
	 * Skips playback forward by 600 seconds.
	 */
	fwd600(): void;

	/**
	 * Skips playback backward by 600 seconds.
	 */
	back600(): void;

	/**
	 * Quits the player.
	 */
	quit(): void;

	/**
	 * Toggle subtitles.
	 */
	subtitles(): void;

	/**
	 * Provides info on the currently playing file.
	 */
	info(): void;

	/**
	 * Increases playback speed.
	 */
	incSpeed(): void;

	/**
	 * Decreases playback speed.
	 */
	decSpeed(): void;

	/**
	 * Skips to previous chapter.
	 */
	prevChapter(): void;

	/**
	 * Skips to next chapter.
	 */
	nextChapter(): void;

	/**
	 * Skips to previous audio stream.
	 */
	prevAudio(): void;

	/**
	 * Skips to next audio stream.
	 */
	nextAudio(): void;

	/**
	 * Skips to previous subtitle stream.
	 */
	prevSubtitle(): void;

	/**
	 * Skips to next subtitle stream.
	 */
	nextSubtitle(): void;

	/**
	 * Decrease subtitle delay by 250ms.
	 */
	decSubDelay(): void;

	/**
	 * Increase subtitle delay by 250ms.
	 */
	incSubDelay(): void;

	/**
	 * Boolean giving the playback status, true if the player is still active, false if it has ended or the player has quit.
	 */
	running: Boolean;
}
