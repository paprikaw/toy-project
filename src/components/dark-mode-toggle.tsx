// set dark mode based on isDarkMode query param

const toggleDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

type Props = {
    onClick?: () => void
    isDarkMode: boolean
}
// const DarkModeToggle = ({ onClick, isDarkMode }: Props) => {

const DarkModeToggle = () => {
    // Get the dark mode from localstorage
    let darkMode = (typeof window !== 'undefined') && localStorage.getItem('darkMode') === 'true';

    // Setting the current theme
    if (typeof window !== 'undefined') {
        toggleDarkMode(darkMode);
    }

    // When the user clicks the dark mode toggle, update the localStorage and set the state
    const onDarkModeClick = () => {
        if (typeof window !== 'undefined') {
            if (!darkMode) {
                console.log('light');
                localStorage.setItem('darkMode', 'true');
                toggleDarkMode(!darkMode);
                darkMode = true;
            } else {
                console.log('dark');
                localStorage.setItem('darkMode', 'false');
                toggleDarkMode(!darkMode);
                darkMode = false;
            }
        }
    }
    return (
        <label className="relative flex justify-between items-center group text-xl hover:cursor-pointer" >
            <input type="checkbox" className="absolute left-1/2 -translate-x-1/2 w-full h-full peer appearance-none rounded-md" defaultChecked={darkMode} onClick={onDarkModeClick} />
            <span className="flex gap-3 items-center flex-shrink-0 px-1 py-[10px] justify-between  bg-yellow-300 rounded-full duration-300 ease-in-out  peer-checked:bg-indigo-700 after:absolute after:w-7 after:h-7 after:bg-white after:rounded-full after:shadow-md  after:duration-300 peer-checked:after:translate-x-7" >
                <i className="gg-moon w-2 ml-1 text-white " />
                <i className="gg-sun w-2 mr-1 text-black " />
            </span>
        </label >
    )
}

export default DarkModeToggle;