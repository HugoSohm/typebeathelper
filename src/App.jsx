import { useState } from 'react'
import './App.css'
import {downloadAudio, getAudio, getCurrentTab, getKeyAndBpm} from "./utils.jsx";
import { Transition } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

function App() {
    const [bpm, setBpm] = useState('');
    const [key, setKey] = useState('');
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);

    const handleCopy = (value) => {
        navigator.clipboard.writeText(value).then(() => {
            setShow(true)
        });
    };

    const handleButtonClick = async () => {
        try {
            setLoader(true);
            const currentTab = await getCurrentTab();

            if (currentTab.hostname !== 'www.youtube.com') {
                setLoader(false);
                console.error('You need to be on https://www.youtube.com to download');
                return;
            }

            console.log('Downloading', currentTab.href);

            const response = await getAudio(currentTab.href)
            if (!response) {
                setLoader(false);
                console.error('No response found');
                return
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);

            downloadAudio(objectUrl, response.headers.get('X-Video-Title'));

            const keyAndBpm = await getKeyAndBpm(objectUrl);

            setLoader(false);
            setBpm(keyAndBpm.bpm);
            setKey(keyAndBpm.key.key + ' ' + keyAndBpm.key.scale);
        } catch (error) {
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
                <button onClick={handleButtonClick}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                    <span
                        className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                        Download & analyze
                        {
                            loader ?
                                <svg aria-hidden="true" role="status" className="inline size-4 ml-1 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                                </svg>
                                :
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 ml-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"/>
                                </svg>
                        }
                    </span>
                </button>
            </div>
            <div className="mt-10">
                <div className="mt-2 flex">
                    <div
                        className="flex shrink-0 items-center rounded-l-md bg-white px-3 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6 w-20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="currentColor" className="size-4 mr-1 text-red-600">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"/>
                        </svg>
                        BPM
                    </div>
                    <input
                        id="bpm"
                        name="bpm"
                        type="text"
                        className="-ml-px block w-2 grow rounded-r-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                        value={bpm}
                        disabled={true}
                    />
                    <button onClick={() => { bpm !== '' ? handleCopy(bpm) : undefined }} className="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"/>
                        </svg>
                    </button>
                </div>
                <div className="mt-2 flex">
                    <div
                        className="flex shrink-0 items-center rounded-l-md bg-white px-3 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6 w-20">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2"
                             stroke="currentColor" className="size-4 mr-1 text-violet-500">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m9 9 10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"/>
                        </svg>
                        KEY
                    </div>
                    <input
                        id="key"
                        name="key"
                        type="text"
                        className="-ml-px block w-2 grow rounded-r-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-gray-300 sm:text-sm/6"
                        value={key}
                        disabled={true}
                    />
                    <button onClick={() => handleCopy(key !== '' ? handleCopy(bpm) : undefined)} className="ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                             stroke="currentColor" className="size-4 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-start justify-center px-4 py-2 sm:items-start sm:p-2"
            >
                <div className="flex w-52 flex-col items-center space-y-2 sm:items-start">
                    <Transition show={show}>
                        <div
                            className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-[closed]:data-[enter]:-translate-y-2 data-[enter]:transform data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-100 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:data-[enter]:sm:translate-x-2 data-[closed]:data-[enter]:sm:translate-y-0">
                            <div className="p-4">
                                <div className="flex items-start">
                                    <div className="shrink-0">
                                        <CheckCircleIcon aria-hidden="true" className="size-6 text-green-400"/>
                                    </div>
                                    <div className="ml-3 w-0 flex-1 pt-0.5">
                                        <p className="text-sm font-medium text-gray-900">Copied !</p>
                                    </div>
                                    <div className="ml-4 flex shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => { setShow(false) }}
                                            className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon aria-hidden="true" className="size-5"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </div>
    );
}

export default App
