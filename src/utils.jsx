export function getCurrentTab() {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs.length) {
                const currentTab = tabs[0];
                const urlObject = new URL(currentTab.url);
                const hostname = urlObject.hostname;
                const href = urlObject.href;

                resolve({ hostname, href });
            } else {
                reject(new Error('No active tab found'));
            }
        });
    });
}

export function downloadAudio(objectUrl, videoTitle) {
    chrome.downloads.download({ url: objectUrl, filename: videoTitle}, function (downloadId) {
        console.log(`Video ${downloadId} downloaded (${videoTitle})`);
    });
}

export async function getAudio(url) {
    const audio = await fetch(`${import.meta.env.VITE_API_BASE_URL}/mp3?url=${url}`);
    if (!audio.ok) {
        console.error(`Error while getting audio for ${url}`);
        return null;
    }

    return audio;
}

async function fetchKeyAndBpm(signal) {
    const blob = new Blob([signal.buffer], { type: 'application/octet-stream' });
    const formData = new FormData();
    formData.append('file', blob, 'audioBuffer.bin');

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/bpm`, {
        method: 'POST',
        body: formData,
    }).catch((error) => {
        console.error('Error while getting key & bpm:', error);
    });
    if (!res.ok) {
        console.error('Error while getting key & bpm');
    }

    return res.json();
}

export  async function getKeyAndBpm(objectUrl) {
    const buffer = await fetch(objectUrl).then((res) => res.arrayBuffer());
    const audioContext = new AudioContext();

    let bpm = null;
    let key = null;

    await audioContext.decodeAudioData(buffer).then(async function handleDecodedAudio(audioBuffer) {
        const preprocessed = preprocess(audioBuffer);
        const res = await fetchKeyAndBpm(preprocessed);

        bpm = res.bpm;
        key = { key: res.key.key, scale: res.key.scale };
    }).catch((error) => {
        console.error('Error decoding audio data:', error);
    });

    return { key, bpm };
}

export function preprocess (audioBuffer) {
    if (audioBuffer instanceof AudioBuffer) {
        const mono = monomix(audioBuffer);
        // downmix to mono, and downsample to 16kHz sr for essentia tensorflow models
        return downsampleArray(mono, audioBuffer.sampleRate, 16000);
    } else {
        throw new TypeError("Input to audio preprocessing is not of type AudioBuffer");
    }
}

function monomix(buffer) {
    // downmix to mono
    let monoAudio;
    if (buffer.numberOfChannels > 1) {
        const leftCh = buffer.getChannelData(0);
        const rightCh = buffer.getChannelData(1);
        monoAudio = leftCh.map( (sample, i) => 0.5 * (sample + rightCh[i]) );
    } else {
        monoAudio = buffer.getChannelData(0);
    }

    return monoAudio;
}

function downsampleArray(audioIn, sampleRateIn, sampleRateOut) {
    if (sampleRateOut === sampleRateIn) {
        return audioIn;
    }
    let sampleRateRatio = sampleRateIn / sampleRateOut;
    let newLength = Math.round(audioIn.length / sampleRateRatio);
    let result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetAudioIn = 0;

    while (offsetResult < result.length) {
        let nextOffsetAudioIn = Math.round((offsetResult + 1) * sampleRateRatio);
        let accum = 0,
          count = 0;
        for (let i = offsetAudioIn; i < nextOffsetAudioIn && i < audioIn.length; i++) {
            accum += audioIn[i];
            count++;
        }
        result[offsetResult] = accum / count;
        offsetResult++;
        offsetAudioIn = nextOffsetAudioIn;
    }

    return result;
}