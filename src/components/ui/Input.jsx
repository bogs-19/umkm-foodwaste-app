export const Input = ({ label, type = "text", placeholder, icon, ...props }) => {
    return (
        <div className="flex flex-col w-full mb-4">
            {label && <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="relative">
                {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A7D189] transition-all ${icon ? 'pl-11 pr-4' : 'px-4'}`}
                    {...props}
                />
            </div>
        </div>
    );
};