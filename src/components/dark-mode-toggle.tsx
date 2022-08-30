type Props = {
    onClick?: () => void
}
const DarkModeToggle = ({ onClick }: Props) => {
    return (
        <label className="relative flex justify-between items-center group text-xl hover:cursor-pointer" onClick={onClick}>
            <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" />
            <span className="flex gap-3 items-center flex-shrink-0 px-1 py-[10px] justify-between bg-blue-500 rounded-full duration-300 ease-in-out  peer-checked:bg-yellow-300 after:absolute after:w-7 after:h-7 after:bg-white after:rounded-full after:shadow-md  after:duration-300 peer-checked:after:translate-x-7" >
                <i className="gg-sun w-2 ml-1 text-black " />
                <i className="gg-moon w-2 mr-1 text-white " />
            </span>
        </label >
    )
}

export default DarkModeToggle;