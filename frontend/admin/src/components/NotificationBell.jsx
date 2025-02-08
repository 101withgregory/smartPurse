import { FiBell } from "react-icons/fi";

const notifications = 5; 

const NotificationBell = () => {
  return (
    <div className="">
      <button className="icon-btn text-2xl hover:text-gray-400 cursor-pointer relative">
        <FiBell />
        {notifications > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center transform translate-x-2 -translate-y-2">
            {notifications}
          </span>
        )}
      </button>
    </div>
  );
};

export default NotificationBell;
