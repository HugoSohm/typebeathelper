import { useState } from 'react'
import './App.css'
import {SuccessToast} from "./components/success.jsx";
import {ErrorToast} from "./components/error.jsx";
import {Field} from "./components/field.jsx";
import {Button} from "./components/button.jsx";
import {handleButtonClick} from "./handlers/handleButtonClick.jsx";
import {handleCopy} from "./handlers/handleCopy.jsx";
import {BuyMeACoffee} from "./components/buyMeACoffee.jsx";

function App() {
    const [bpm, setBpm] = useState('');
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [loader, setLoader] = useState(false);
    const [bpmAndKeyLoader, setBpmAndKeyLoader] = useState(false);

    const handleButtonClickWrapper = async () => {
        await handleButtonClick(setLoader, setBpmAndKeyLoader, setError, setShowError, setBpm, setKey, setShowSuccess);
    };

    const handleCopyWrapper = async (value) => {
        await handleCopy(value, setShowSuccess);
    }

    return (
        <div>
            <BuyMeACoffee/>
            <div>
                <h1 className="text-white text-3xl font-bold">Type Beat Helper</h1>
            </div>
            <div className="mt-10">
                <Button loader={loader} onClick={handleButtonClickWrapper}/>
            </div>
            <div className="mt-10 text-white">
                <Field value={bpm} type={'BPM'} loader={bpmAndKeyLoader} onClick={handleCopyWrapper}></Field>
                <Field value={key} type={'KEY'} loader={bpmAndKeyLoader} onClick={handleCopyWrapper}></Field>
            </div>
            <SuccessToast showSuccess={showSuccess} onClose={() => setShowSuccess(false)}/>
            <ErrorToast showError={showError} onClose={() => setShowError(false)} error={error}/>
        </div>
    );
}

export default App
