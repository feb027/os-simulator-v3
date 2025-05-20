import React, { useState, useRef } from 'react';
import {
  FiSettings, FiMonitor, FiUser, FiInfo, FiFolder, FiUpload, FiImage, FiLayout, FiCheckCircle
} from 'react-icons/fi';
import useDesktopStore from '../../stores/desktopStore';
import toast from 'react-hot-toast';

function Settings() {
  // State to track the active settings section
  const [activeSection, setActiveSection] = useState('display'); // Default to display

  // Store access
  const username = 'SimUser'; // Placeholder
  const fileExplorerSettings = useDesktopStore((state) => state.fileExplorerSettings);
  const setFileExplorerSetting = useDesktopStore((state) => state.setFileExplorerSetting);
  const desktopBackground = useDesktopStore((state) => state.desktopBackground);
  const setDesktopBackground = useDesktopStore((state) => state.setDesktopBackground);
  const isTaskbarLocked = useDesktopStore((state) => state.isTaskbarLocked); // Taskbar Lock state
  const toggleTaskbarLock = useDesktopStore((state) => state.toggleTaskbarLock); // Taskbar Lock action
  const isNightLightEnabled = useDesktopStore((state) => state.isNightLightEnabled); // Get Night Light state
  const toggleNightLight = useDesktopStore((state) => state.toggleNightLight); // Get Night Light action
  const fileInputRef = useRef(null);

  // Handlers (keep existing ones)
  const handleDefaultViewChange = (event) => {
    setFileExplorerSetting('defaultView', event.target.value);
  };

  const handleBackgroundChange = (type) => {
    setDesktopBackground({ type: type, customUrl: null });
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Silakan pilih file gambar.');
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error(`Ukuran gambar tidak boleh melebihi ${maxSize / 1024 / 1024}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (readEvent) => {
      setDesktopBackground({ type: 'custom-image', customUrl: readEvent.target.result });
      toast.success('Latar belakang kustom diatur!');
    };
    reader.onerror = (error) => {
      console.error("Kesalahan membaca file gambar:", error);
      toast.error('Tidak dapat membaca file gambar.');
    };
    reader.readAsDataURL(file);
    event.target.value = null;
  };

  // Define sections for sidebar navigation
  const sections = [
    { id: 'display', label: 'Display', icon: FiMonitor, color: 'text-blue-500' },
    { id: 'taskbar', label: 'Taskbar', icon: FiLayout, color: 'text-purple-500' }, // Added Taskbar
    { id: 'fileExplorer', label: 'File Explorer', icon: FiFolder, color: 'text-orange-500' },
    { id: 'account', label: 'Account', icon: FiUser, color: 'text-green-500' },
    { id: 'about', label: 'Tentang', icon: FiInfo, color: 'text-yellow-500' },
  ];

  // Helper function to render checkmark overlay for active background
  const renderActiveCheck = (isActive) => {
      return isActive && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded">
              <FiCheckCircle className="w-5 h-5 text-white" />
          </div>
      );
  };

  // Helper to render content based on active section
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'display':
        return (
          <section aria-labelledby="display-heading" className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <h2 id="display-heading" className="text-base font-semibold mb-0 p-3 flex items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <FiMonitor className="mr-2 text-blue-500"/> Display
            </h2>
            <div className="p-4 space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pilih latar belakang Anda:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                     {/* Gradient 1 Preview */}
                     <div 
                        onClick={() => handleBackgroundChange('gradient-1')} 
                        className={`aspect-video rounded border-2 cursor-pointer overflow-hidden relative group ${desktopBackground?.type === 'gradient-1' ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                        title="Gradient Background 1"
                     >
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600"></div>
                       {renderActiveCheck(desktopBackground?.type === 'gradient-1')} 
                     </div>
                     {/* Gradient 2 Preview */}
                     <div 
                        onClick={() => handleBackgroundChange('gradient-2')} 
                        className={`aspect-video rounded border-2 cursor-pointer overflow-hidden relative group ${desktopBackground?.type === 'gradient-2' ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                        title="Gradient Background 2"
                     >
                       <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500"></div>
                       {renderActiveCheck(desktopBackground?.type === 'gradient-2')}
                     </div>
                     {/* Solid Gray Preview */}
                     <div 
                        onClick={() => handleBackgroundChange('solid-gray')} 
                        className={`aspect-video rounded border-2 cursor-pointer overflow-hidden relative group ${desktopBackground?.type === 'solid-gray' ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'}`}
                        title="Solid Gray Background"
                     >
                       <div className="absolute inset-0 bg-gray-500"></div>
                       {renderActiveCheck(desktopBackground?.type === 'solid-gray')}
                     </div>
                     {/* Custom Background Preview */}
                     <div 
                       className={`aspect-video rounded border-2 flex items-center justify-center relative ${desktopBackground?.type === 'custom-image' ? 'border-blue-500 ring-2 ring-blue-300 ring-offset-1' : 'border-gray-300 dark:border-gray-600'} bg-gray-200 dark:bg-gray-700 overflow-hidden`}
                       title="Custom Background"
                     >
                         {desktopBackground?.type === 'custom-image' && desktopBackground?.customUrl ? (
                            <img src={desktopBackground.customUrl} alt="Custom BG Preview" className="absolute inset-0 w-full h-full object-cover" />
                         ) : (
                            <FiImage className="w-6 h-6 text-gray-400 dark:text-gray-500 z-10" /> 
                         )}
                         {renderActiveCheck(desktopBackground?.type === 'custom-image')} 
                     </div>
                  </div>
               </div>
               
               {/* Upload / Remove Section */}
               <div className="flex items-center justify-start space-x-3">
                 <button onClick={handleUploadButtonClick} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded shadow-sm flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"> 
                    <FiUpload className="mr-1.5 -ml-0.5 w-4 h-4" /> Unggah Gambar...
                 </button>
                 {/* Conditionally show Remove button */} 
                 {desktopBackground?.type === 'custom-image' && (
                    <button 
                       onClick={() => handleBackgroundChange('gradient-1')} // Revert to default gradient
                       className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 text-xs font-medium rounded shadow-sm flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                    >
                       Hapus Latar Belakang Kustom
                    </button>
                 )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
               </div>

               {/* Divider */} 
               <hr className="border-gray-200 dark:border-gray-700" />
               
               {/* Night Light Section - Using Toggle Switch */}
               <div className="flex items-center justify-between">
                 <div>
                    <label htmlFor="night-light-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lampu Malam</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Mengurangi cahaya biru untuk membantu Anda tidur lebih baik.</p>
                 </div>
                 {/* Toggle Switch Component */}
                 <button
                    type="button"
                    id="night-light-toggle" 
                    onClick={toggleNightLight} // Call the action directly
                    className={`${ isNightLightEnabled ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600' } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                    role="switch"
                    aria-checked={isNightLightEnabled}
                 >
                   <span className="sr-only">Gunakan pengaturan</span>
                   <span
                     aria-hidden="true"
                     className={`${ isNightLightEnabled ? 'translate-x-4' : 'translate-x-0' } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                   />
                 </button>
               </div>

            </div>
          </section>
        );
      case 'taskbar': // NEW Taskbar Section
        return (
          <section aria-labelledby="taskbar-heading" className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <h2 id="taskbar-heading" className="text-base font-semibold mb-0 p-3 flex items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <FiLayout className="mr-2 text-purple-500"/> Taskbar
            </h2>
            <div className="p-4 space-y-4">
               {/* Lock Taskbar - Using Toggle Switch */} 
               <div className="flex items-center justify-between">
                  <div>
                     <label htmlFor="lock-taskbar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kunci Taskbar</label>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Mencegah pemindahan atau perubahan item yang disematkan.</p>
                  </div>
                  <button
                      type="button"
                      id="lock-taskbar"
                      onClick={toggleTaskbarLock} // Use the action directly
                      className={`${ isTaskbarLocked ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600' } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                      role="switch"
                      aria-checked={isTaskbarLocked}
                  >
                    <span className="sr-only">Gunakan pengaturan</span>
                    <span
                      aria-hidden="true"
                      className={`${ isTaskbarLocked ? 'translate-x-4' : 'translate-x-0' } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
               </div>
            </div>
          </section>
        );
      case 'fileExplorer':
        return (
          <section aria-labelledby="fe-heading" className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <h2 id="fe-heading" className="text-base font-semibold mb-0 p-3 flex items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <FiFolder className="mr-2 text-orange-500"/> Penjelajah File
            </h2>
            <div className="p-4 space-y-6">
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode Tampilan Default:</label>
                  <div className="flex items-center space-x-6">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="radio" className="form-radio appearance-none h-4 w-4 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors" name="defaultViewMode" value="grid" checked={fileExplorerSettings?.defaultView === 'grid'} onChange={handleDefaultViewChange} />
                      <span className="ml-2 text-sm">Grid</span>
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="radio" className="form-radio appearance-none h-4 w-4 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 checked:bg-blue-600 checked:border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 focus:ring-blue-500 transition-colors" name="defaultViewMode" value="list" checked={fileExplorerSettings?.defaultView === 'list'} onChange={handleDefaultViewChange} />
                      <span className="ml-2 text-sm">Daftar</span>
                    </label>
                  </div>
              </div>
              {/* Show Hidden Files - Using Toggle Switch */}
              <div className="flex items-center justify-between">
                  <div>
                     <label htmlFor="show-hidden-files" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tampilkan File Tersembunyi</label>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Menampilkan file dan folder yang dimulai dengan titik (.).</p>
                  </div>
                   <button
                       type="button"
                       id="show-hidden-files"
                       onClick={() => setFileExplorerSetting('showHiddenFiles', !(fileExplorerSettings?.showHiddenFiles || false))} /* Simplified boolean toggle */ 
                       className={`${ (fileExplorerSettings?.showHiddenFiles || false) ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600' } relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800`}
                       role="switch"
                       aria-checked={fileExplorerSettings?.showHiddenFiles || false} /* Simplified boolean */
                   >
                     <span className="sr-only">Gunakan pengaturan</span>
                     <span
                       aria-hidden="true"
                       className={`${ (fileExplorerSettings?.showHiddenFiles || false) ? 'translate-x-4' : 'translate-x-0' } pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                     />
                   </button>
              </div>
            </div>
          </section>
        );
      case 'account':
        return (
          <section aria-labelledby="account-heading" className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <h2 id="account-heading" className="text-base font-semibold mb-0 p-3 flex items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <FiUser className="mr-2 text-green-500"/> Akun
            </h2>
             <div className="p-4">
               <p className="text-sm text-gray-700 dark:text-gray-300">Masuk sebagai: <span className="font-semibold text-gray-800 dark:text-gray-200">{username}</span></p>
             </div>
          </section>
        );
      case 'about':
        return (
           <section aria-labelledby="about-heading" className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <h2 id="about-heading" className="text-base font-semibold mb-0 p-3 flex items-center bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <FiInfo className="mr-2 text-yellow-500"/> Tentang
            </h2>
             <div className="p-4 space-y-3">
               <div>
                 <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">OS Simulator</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">Versi 0.1.1 - Alpha</p> 
               </div>
               <div>
                 <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                   Proyek ini adalah simulasi antarmuka sistem operasi desktop modern yang dibuat menggunakan React dan Zustand untuk manajemen state, serta Tailwind CSS untuk styling. Tujuannya adalah untuk mendemonstrasikan pembuatan komponen UI interaktif yang umum ditemukan di OS desktop.
                 </p>
               </div>
               <div>
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Dibuat oleh:</h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Leli Donaningrum</li>
                    <li>Renasya Malkahaq</li>
                    <li>Arie Afriza Pahrozan</li>
                    <li>Febnawan Fatur Rochman</li>
                    <li>Dikri Asrul Fauzi</li>
                  </ul>
               </div>
             </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-y-auto">
        <div className="p-3 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-semibold flex items-center">
            <FiSettings className="mr-2 text-gray-600 dark:text-gray-400" /> Pengaturan
          </h1>
        </div>
        <nav className="p-2 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900 transition-colors duration-150 ${ 
                activeSection === section.id
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <section.icon className={`mr-3 h-5 w-5 flex-shrink-0 ${section.color}`} aria-hidden="true" />
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {renderSectionContent()} 
        </div>
      </main>
    </div>
  );
}

export default Settings; 