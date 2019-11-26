'use strict';
const spawn = require('child_process').spawn;
const EventEmitter = require('events');

// The permitted audio outputs, local means via the 3.5mm jack.
const ALLOWED_OUTPUTS = ['hdmi', 'local', 'both', 'alsa'];

exports.AudioOutput = {
	HDMI: 'hdmi',
	jack: 'local',
	both: 'both',
	alsa: 'alsa'
};

exports.VideoOutput = {
	HDMI0: 2,
	HDMI1: 7,
	LCD: 4,
};

const createVideoPlayer = (globalParams = {}) =>{
	// ----- Local Vars ----- //
	const omxplayer = new EventEmitter();
	let player = null;
	let open = false;

	// ----- Local Functions ----- //
	// Marks player as closed.
	const updateStatus = () => {
		open = false;
		omxplayer.emit('close');
	};
	// Emits an error event, with a given message.
	const emitError = (message) => {
		open = false;
		omxplayer.emit('error', message);
	};
	// Spawns the omxplayer process.
	const spawnPlayer = params => {
		let args = buildArgs({...globalParams, ...params});
		process.env.NODE_ENV === 'development' && console.log('args for omxplayer:', args);
		let omxProcess = spawn('omxplayer', args);
		open = true;

		omxProcess.stdin.setEncoding('utf-8');
		omxProcess.on('close', updateStatus);

		omxProcess.on('error', () => {
			emitError('Problem running omxplayer, is it installed?.');
		});

		return omxProcess;
	};
	// Simulates keypress to provide control.
	const writeStdin = value => {
		if (open) {
			player.stdin.write(value);
		} else {
			throw new Error('Player is closed.');
		}
	};

	// ----- Methods ----- //
	// Open a video file and set params
	omxplayer.open = params => {
		if (open) {
			player.on('close', () => { player = spawnPlayer(params); });
			player.removeListener('close', updateStatus);
			writeStdin('q');
		} else {
			player = spawnPlayer(params);
		}
	};
	omxplayer.play = () => { writeStdin('p'); };
	omxplayer.pause = () => { writeStdin('p'); };
	omxplayer.volUp = () => { writeStdin('+'); };
	omxplayer.volDown = () => { writeStdin('-'); };
	omxplayer.fastFwd = () => { writeStdin('>'); };
	omxplayer.rewind = () => { writeStdin('<'); };
	omxplayer.fwd30 =() => { writeStdin('\u001b[C'); };
	omxplayer.back30 = () => { writeStdin('\u001b[D'); };
	omxplayer.fwd600 = () => { writeStdin('\u001b[A'); };
	omxplayer.back600 = () => { writeStdin('\u001b[B'); };
	omxplayer.quit = () => { writeStdin('q'); };
	omxplayer.subtitles = () => { writeStdin('s'); };
	omxplayer.info = () => { writeStdin('z'); };
	omxplayer.incSpeed = () => { writeStdin('1'); };
	omxplayer.decSpeed = () => { writeStdin('2'); };
	omxplayer.prevChapter = () => { writeStdin('i'); };
	omxplayer.nextChapter = () => { writeStdin('o'); };
	omxplayer.prevAudio = () => { writeStdin('j'); };
	omxplayer.nextAudio = () => { writeStdin('k'); };
	omxplayer.prevSubtitle = () => { writeStdin('n'); };
	omxplayer.nextSubtitle = () => { writeStdin('m'); };
	omxplayer.decSubDelay = () => { writeStdin('d'); };
	omxplayer.incSubDelay = () => { writeStdin('f'); };

	Object.defineProperty(omxplayer, 'running', {
		get: () => { return open; }
	});

	return omxplayer;
};

// Creates an array of arguments to pass to omxplayer's cli
const buildArgs  = ({source, audio = 'local', display = 2, loop = false, initialVolume, osd = false}) => {

	if (audio) {
		if (ALLOWED_OUTPUTS.indexOf(audio) === -1) {
			throw new Error(`Output ${audio} not allowed.`);
		}
	}

	let args = [source, '-o', audio, '--blank', '--display', display, osd ? '' : '--no-osd'];

	// Handle the loop argument, if provided
	if (loop) {
		args.push('--loop');
	}

	// Handle the initial volume argument, if provided
	if (Number.isInteger(initialVolume)) {
		args.push('--vol', initialVolume);
	}

	return args;

};

module.exports = createVideoPlayer;
