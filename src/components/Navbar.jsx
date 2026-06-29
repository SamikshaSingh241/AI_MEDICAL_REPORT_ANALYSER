import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Medi<span className="text-teal-500">Sense</span> AI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                <SunIcon className="w-5 h-5 text-slate-300 hover:text-amber-400 transition-colors" />
              ) : (
                <MoonIcon className="w-5 h-5 text-slate-600 hover:text-slate-900 transition-colors" />
              )}
            </button>
            
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900">
                <UserCircleIcon className="w-8 h-8 text-slate-400 hover:text-teal-500 transition-colors" />
              </Menu.Button>
              <Transition
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white dark:bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-slate-100 dark:border-slate-700 overflow-hidden">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => navigate('/login')}
                        className={`
                          ${active ? 'bg-slate-50 dark:bg-slate-700/50' : ''}
                          flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 transition-colors
                        `}
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
