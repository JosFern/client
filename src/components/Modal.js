export default function Modal(props) {
    function setToggle() {
        props.toggle(false)
    }
    return (
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)] w-[100%] h-[100%]">
            <div className="relative top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] flex flex-col bg-white justify-center items-center w-[350px] rounded-lg py-4">
                <span className="absolute top-1 right-1 cursor-pointer font-black bg-[#192a56] hover:bg-[#40739e] rounded-md px-3 py-1 text-white" onClick={setToggle}>X</span>
                {props.children}
            </div>
        </div>
    )
}