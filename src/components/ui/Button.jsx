export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyle = "w-full py-3 px-4 rounded-full font-semibold transition-all duration-300 flex justify-center items-center gap-2";

    const variants = {
        primary: "bg-[#1A361D] text-white hover:bg-[#122614] shadow-md", // Hijau gelap dari referensi
        secondary: "bg-[#A7D189] text-black hover:bg-[#95C276]", // Hijau terang
        outline: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50", // Untuk tombol Google/Apple
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};