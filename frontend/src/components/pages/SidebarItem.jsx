// components/SidebarItem.jsx
export default function SidebarItem({ icon, text }) {
  return (
    <li className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer text-lg p-3 rounded-lg transition">
      {icon}
      <span>{text}</span>
    </li>
  );
}
