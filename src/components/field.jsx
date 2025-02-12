import {ClipboardDocumentIcon, HeartIcon, SparklesIcon} from "@heroicons/react/24/outline/index.js";
import PropTypes from "prop-types";
import {Loader} from "./loader.jsx";

export const Field = ({ value, type, loader, onClick }) => {
    return (
        <div className="mt-2 flex relative h-10">
            <div className="flex shrink-0 items-center rounded-l-md px-3 text-base text-white analyze outline outline-1 -outline-offset-1  sm:text-sm/6 w-20">
                {type === 'BPM' ? <HeartIcon aria-hidden="true" strokeWidth="1.5" className="size-4 mr-1 text-red-500"/> : <SparklesIcon aria-hidden="true" strokeWidth="1.5" className="size-4 mr-1 text-violet-500"/>}
                {type === 'BPM' ? 'BPM' : 'KEY'}
            </div>
            <div className="-ml-px block w-2 grow rounded-r-md pl-3 pr-7 py-1.5 text-base text-white outline outline-1 -outline-offset-1 sm:text-sm/6">
                <span>{value !== '' ? type === 'BPM' ? Math.round(value) : value : loader ? <Loader/> : value}</span>
                <button onClick={() => {value !== '' ? onClick(value) : undefined}} className="ml-2 absolute right-2 top-1/2 -translate-y-1/2">
                    <ClipboardDocumentIcon aria-hidden="true" strokeWidth="1.5" className="size-4 text-white"/>
                </button>
            </div>
        </div>
    )
}

Field.propTypes = {
    value: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    loader: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};