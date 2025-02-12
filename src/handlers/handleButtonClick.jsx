import {downloadAudio, getAudio, getCurrentTab, getKeyAndBpm} from "../utils.jsx";

export const handleButtonClick = async (setLoader, setBpmAndKeyLoader, setError, setShowError, setBpm, setKey, setShowSuccess) => {
    try {
        const currentTab = await getCurrentTab();
        if (currentTab.hostname !== 'www.youtube.com') {
            setError('You need to be on youtube.com')
            setShowError(true)
            return;
        }

        setLoader(true);
        setBpmAndKeyLoader(true);

        const response = await getAudio(currentTab.href)
        if (!response) {
            setLoader(false);
            setBpmAndKeyLoader(false);
            setError('Failed to get audio from API')
            setShowError(true)
            return
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);

        downloadAudio(objectUrl, response.headers.get('X-Video-Title'));
        setLoader(false);

        const keyAndBpm = await getKeyAndBpm(objectUrl);

        setBpmAndKeyLoader(false);
        setBpm(keyAndBpm.bpm);
        setKey(keyAndBpm.key.key + ' ' + keyAndBpm.key.scale);
    } catch (error) {
        setLoader(false);
        setBpmAndKeyLoader(false);
        setError('Unknown error, please try again or contact owner')
        setShowError(true)
        console.error(error.message);
    }
};
