import buyMeACoffee from "../../public/buymeacoffee.svg";

export const BuyMeACoffee = () => {
    return (
        <div className="absolute bottom-0 right-0 w-20 mb-4 mr-4">
            <a
                href="https://www.buymeacoffee.com/hugosohm"
                target="_blank"
                rel="noopener"
                className="flex items-center"
            >
                <img src={buyMeACoffee} alt="buy Me a Coffee"/>
            </a>
        </div>
    )
};