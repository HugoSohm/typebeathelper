import { useState } from 'react'
import './App.css'
import {downloadAudio, getAudio, getCurrentTab, getKeyAndBpm} from "./utils.jsx";
import {SuccessToast} from "./components/success.jsx";
import {ErrorToast} from "./components/error.jsx";
import {Field} from "./components/field.jsx";
import {Button} from "./components/button.jsx";

function App() {
    const [bpm, setBpm] = useState('');
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [bpmAndKeyLoader, setBpmAndKeyLoader] = useState(false);

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value).then(() => {
            setShowSuccess(true)
        });
    };

    const handleButtonClick = async () => {
        try {
            setLoader(true);
            setBpmAndKeyLoader(true);
            const currentTab = await getCurrentTab();

            if (currentTab.hostname !== 'www.youtube.com') {
                setLoader(false);
                setBpmAndKeyLoader(false);
                setError('You need to be on youtube.com')
                setShowError(true)
                return;
            }

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

    return (
        <div>
            <div>
                <h1 className="text-white text-3xl font-bold">Type Beat Helper</h1>
                <p className="text-white mt-2 font-medium subtitle tracking-wider">Get MP3 with BPM & Key</p>
            </div>
            <div className="mt-10">
                <Button loader={loader} onClick={handleButtonClick}/>
            </div>
            <div className="mt-10 text-white">
                <Field value={bpm} type={'BPM'} loader={bpmAndKeyLoader} onClick={handleCopy}></Field>
                <Field value={key} type={'KEY'} loader={bpmAndKeyLoader} onClick={handleCopy}></Field>
            </div>
            <SuccessToast showSuccess={showSuccess} onClose={() => setShowSuccess(false)}/>
            <ErrorToast showError={showError} onClose={() => setShowError(false)} error={error}/>
        </div>
    );
}

export default App
