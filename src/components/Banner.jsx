import Button from "./Button";

function Banner({ btnText, btnOnClick }) {
    return (
        <>
            <header>
                <img
                    src="/assets/horizontal-logo.svg"
                    alt="metis-logo-horizontal"
                    id="metis-logo-horizontal"
                />
                <span className="header-text">FEES WTF</span>
                <Button text={btnText} onClick={btnOnClick} />
            </header>
            <hr></hr>
        </>
    );
}

export default Banner;
