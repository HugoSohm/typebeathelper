export const handleCopy = (value, setShowSuccess) => {
    navigator.clipboard.writeText(value).then(() => {
        setShowSuccess(true)
    });
};