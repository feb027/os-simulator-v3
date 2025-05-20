# Penjelasan Aplikasi OS Simulator

Aplikasi OS Simulator ini adalah sebuah proyek antarmuka pengguna (UI) yang mensimulasikan lingkungan desktop sistem operasi modern. Dibangun menggunakan React, Zustand untuk manajemen state, dan Tailwind CSS untuk styling. Aplikasi ini bertujuan untuk mendemonstrasikan pembuatan komponen UI interaktif yang umum ditemukan di OS desktop.

## Filosofi dan Tujuan Proyek

Tujuan utama dari proyek ini adalah edukatif dan demonstratif:
1.  **Mempelajari Konsep OS**: Mensimulasikan elemen-elemen dasar antarmuka pengguna sistem operasi seperti desktop, jendela, taskbar, file system, dan aplikasi dasar.
2.  **Praktik Pengembangan Web Modern**: Menggunakan teknologi modern seperti React, Zustand, dan Tailwind CSS untuk membangun antarmuka yang interaktif dan responsif.
3.  **Demonstrasi UI/UX**: Menunjukkan bagaimana berbagai komponen UI dapat bekerja bersama untuk menciptakan pengalaman pengguna yang kohesif.
4.  **Modularitas dan Skalabilitas**: Merancang komponen agar dapat digunakan kembali dan arsitektur state yang memungkinkan penambahan fitur di masa depan.

## Teknologi yang Digunakan Beserta Alasannya

Berikut adalah teknologi utama yang digunakan dalam proyek ini dan alasan pemilihannya:

*   **React (dengan Vite sebagai build tool)**:
    *   **Mengapa React?**: React adalah library JavaScript yang populer untuk membangun antarmuka pengguna.
        *   **Komponen**: Memungkinkan pemecahan UI menjadi komponen-komponen independen yang dapat digunakan kembali, membuat kode lebih terorganisir dan mudah dikelola (misalnya, `Window.jsx`, `Taskbar.jsx`, `DesktopIcon.jsx`).
        *   **Deklaratif**: Pengembang mendeskripsikan *apa* yang seharusnya ditampilkan UI berdasarkan state saat ini, dan React akan mengurus pembaruan DOM secara efisien.
        *   **Virtual DOM**: React menggunakan Virtual DOM untuk optimasi performa. Perubahan pada state akan dihitung perbedaannya (diffing) di Virtual DOM terlebih dahulu sebelum pembaruan aktual dilakukan pada DOM browser, meminimalkan manipulasi DOM yang mahal.
        *   **Ekosistem Besar**: Memiliki komunitas yang besar dan banyak library pendukung (seperti `react-draggable`, `react-resizable`, `framer-motion`).
    *   **Vite**: Digunakan sebagai build tool modern yang menawarkan pengalaman pengembangan yang sangat cepat berkat Hot Module Replacement (HMR) yang instan dan build yang dioptimalkan.

*   **Zustand**:
    *   **Mengapa Zustand?**: Zustand adalah solusi manajemen state yang minimalis dan fleksibel untuk React.
        *   **Sederhana & Ringkas**: API-nya kecil dan mudah dipelajari. Hanya memerlukan sedikit boilerplate untuk membuat store dan menggunakannya di komponen.
        *   **Berbasis Hooks**: Terintegrasi secara alami dengan React Hooks, membuat pengambilan dan pembaruan state di komponen menjadi intuitif (misalnya, `const windows = useDesktopStore((state) => state.windows);`).
        *   **Tidak Opiniatif**: Tidak memaksakan struktur atau pola tertentu, memberikan kebebasan kepada pengembang.
        *   **Performa**: Dioptimalkan untuk mencegah re-render yang tidak perlu. Komponen hanya akan re-render jika bagian state yang mereka "subscribe" benar-benar berubah.
        *   **Middleware**: Mendukung middleware seperti `persist` untuk menyimpan state ke local storage (digunakan di `desktopStore.js`) dan `immer` untuk pembaruan state yang immutable dengan lebih mudah.

*   **Immer (digunakan bersama Zustand)**:
    *   **Mengapa Immer?**: Immer menyederhanakan proses pembaruan state yang immutable.
        *   **Kode Lebih Mudah Dibaca**: Memungkinkan penulisan kode mutasi state seolah-olah dilakukan secara langsung (mutable), namun Immer akan menghasilkan state baru yang immutable di belakang layar (misalnya, `set(produce(draft => { draft.someValue = newValue; }));`). Ini mengurangi kompleksitas dibandingkan dengan melakukan spread operator secara manual untuk objek atau array yang bersarang.

*   **Tailwind CSS**:
    *   **Mengapa Tailwind CSS?**: Framework CSS utility-first yang memungkinkan pembuatan UI kustom dengan cepat tanpa menulis CSS kustom dari awal.
        *   **Rapid Prototyping & Development**: Menyediakan banyak kelas utilitas (misalnya, `flex`, `p-4`, `text-white`, `rounded-lg`) yang dapat digabungkan langsung di dalam JSX/HTML.
        *   **Konsistensi Desain**: Membantu menjaga konsistensi visual karena menggunakan skala desain yang telah ditentukan (untuk spasi, ukuran font, warna, dll.).
        *   **Kustomisasi Tinggi**: Sangat mudah untuk dikonfigurasi dan diperluas sesuai kebutuhan proyek.
        *   **Ukuran Build Kecil**: Dengan PurgeCSS (yang terintegrasi secara default), hanya kelas utilitas yang benar-benar digunakan dalam proyek yang akan disertakan dalam file CSS final, menghasilkan ukuran file yang optimal.

*   **Framer Motion**:
    *   **Mengapa Framer Motion?**: Library animasi yang kuat dan mudah digunakan untuk React.
        *   **Animasi Deklaratif**: Memungkinkan pendefinisian animasi langsung di dalam JSX dengan cara yang intuitif (misalnya, `<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />`).
        *   **Animasi Fisika & Gestur**: Mendukung animasi berbasis fisika dan penanganan gestur yang kompleks.
        *   **`AnimatePresence`**: Komponen yang sangat berguna untuk menganimasikan komponen saat masuk dan keluar dari React tree (digunakan untuk jendela, modal, Start Menu, dll.).

*   **React Draggable & React Resizable**:
    *   **Mengapa library ini?**: Menyediakan fungsionalitas inti untuk membuat elemen dapat di-drag (dipindahkan) dan di-resize.
        *   **`React Draggable`**: Digunakan di `DraggableDesktopIcon.jsx` dan `Window.jsx` untuk memungkinkan ikon dan jendela dipindahkan oleh pengguna.
        *   **`React Resizable` (`ResizableBox`)**: Digunakan di `Window.jsx` untuk memungkinkan pengguna mengubah ukuran jendela.
        *   Menggunakan library ini menghemat waktu dibandingkan mengimplementasikan logika drag dan resize yang kompleks dari awal.

*   **React Hot Toast**:
    *   **Mengapa React Hot Toast?**: Library untuk menampilkan notifikasi (toast) yang sederhana dan dapat dikustomisasi.
        *   **Mudah Digunakan**: API yang simpel untuk memicu notifikasi dari mana saja dalam aplikasi (misalnya, `toast.success('File saved!')`).
        *   **Kustomisasi**: Memungkinkan kustomisasi tampilan dan perilaku toast. Digunakan di `Desktop.jsx` untuk menampilkan feedback atas aksi pengguna.

*   **Headless UI**:
    *   **Mengapa Headless UI?**: Menyediakan komponen UI primitif yang sepenuhnya tidak berstyle dan dapat diakses, seperti Menu (dropdown).
        *   **Fleksibilitas Styling**: Memberikan logika dan aksesibilitas inti, sementara styling sepenuhnya dikontrol oleh pengembang (biasanya menggunakan Tailwind CSS). Digunakan di `TextEditor.jsx` untuk menu File/Edit.
        *   **Aksesibilitas**: Dirancang dengan mempertimbangkan standar aksesibilitas (WAI-ARIA).

*   **React Icons**:
    *   **Mengapa React Icons?**: Menyediakan koleksi ikon populer sebagai komponen React.
        *   **Kemudahan Penggunaan**: Memudahkan penambahan ikon ke dalam aplikasi tanpa perlu mengelola file SVG secara manual. Berbagai set ikon (Font Awesome, Feather Icons, dll.) disertakan.

## Struktur Proyek

Struktur utama proyek di dalam direktori `src` adalah sebagai berikut:

- **`main.jsx`**: Titik masuk utama aplikasi. Menggunakan `createRoot` dari `react-dom/client` untuk merender komponen `App` ke dalam elemen DOM dengan ID `root`. Mengaktifkan `StrictMode` dari React untuk menyoroti potensi masalah dalam aplikasi.
- **`App.jsx`**: Komponen fungsional sederhana yang bertindak sebagai root aplikasi. Tugas utamanya adalah merender komponen `Desktop`.
- **`index.css`**: File CSS global. Mengimpor semua utilitas Tailwind CSS melalui `@import "tailwindcss";`. Juga mendefinisikan beberapa style global khusus untuk handle `react-resizable` yang digunakan pada komponen jendela, serta animasi `slide-up` (meskipun beberapa animasi kini mungkin ditangani oleh Framer Motion) dan style untuk scrollbar.
- **`App.css`**: File CSS spesifik untuk komponen `App` (dan beberapa style global lainnya yang mungkin lebih cocok di `index.css`). Termasuk style untuk logo (animasi `logo-spin`) dan kursor berkedip untuk input terminal.
- **`components/`**: Direktori yang berisi semua komponen UI yang dapat digunakan kembali.
    - **`Desktop/Desktop.jsx`**: Komponen inti yang merepresentasikan seluruh area desktop. Bertanggung jawab untuk merender ikon, jendela yang terbuka, taskbar, Start Menu, dan modal global.
    - **`taskbar/Taskbar.jsx`**: Komponen untuk taskbar di bagian bawah layar. Menampilkan tombol Start, aplikasi yang berjalan/di-pin, dan system tray.
    - **`window/Window.jsx`**: Komponen untuk jendela aplikasi yang dapat di-drag dan di-resize. Setiap aplikasi akan dirender di dalam komponen ini.
    - **`desktopIcon/`**:
        - `DesktopIcon.jsx`: Komponen presentasional untuk satu ikon di desktop.
        - `DraggableDesktopIcon.jsx`: Wrapper yang membuat `DesktopIcon` dapat di-drag.
    - **`startMenu/StartMenu.jsx`**: Komponen untuk Start Menu yang muncul saat tombol Start diklik.
    - **`contextMenu/ContextMenu.jsx`**: Komponen generik untuk menampilkan menu konteks (menu klik kanan).
    - **`modal/`**: Berisi berbagai jenis modal dialog:
        - `Modal.jsx`: Komponen dasar untuk semua modal.
        - `InputModal.jsx`: Untuk input teks sederhana.
        - `ConfirmModal.jsx`: Untuk dialog konfirmasi ya/tidak.
        - `SaveAsDialog.jsx`: Dialog kompleks untuk menyimpan file dengan pilihan path dan nama file.
        - `SimpleDisplayModal.jsx`: Modal sederhana untuk menampilkan informasi.
    - **`systemTray/`**: Komponen untuk area system tray di taskbar.
        - `DateTimeWidget.jsx`: Menampilkan jam, tanggal, dan kalender.
        - `VolumeControl.jsx`: Panel kontrol volume.
        - `WifiPanel.jsx`: Panel status Wi-Fi.
    - **`apps/`**: Berisi komponen-komponen yang merepresentasikan aplikasi individual yang berjalan di dalam jendela.
        - `FileExplorer.jsx`: Aplikasi untuk menjelajah file system simulasi.
        - `Terminal.jsx`: Aplikasi terminal untuk interaksi baris perintah.
        - `Settings.jsx`: Aplikasi untuk mengubah pengaturan simulator.
        - `TextEditor.jsx`: Aplikasi editor teks sederhana.
        - `ImageViewer.jsx`: Aplikasi untuk melihat gambar.
        - `FileTreeSidebar.jsx`: Komponen sidebar yang digunakan oleh `FileExplorer.jsx` untuk menampilkan struktur direktori.
    - **`utils/NightLightOverlay.jsx`**: Komponen utilitas untuk efek Night Light (overlay berwarna hangat).
- **`stores/`**: Berisi logika manajemen state menggunakan Zustand.
    - **`desktopStore.js`**: Store utama dan paling komprehensif. Mengelola state global aplikasi, termasuk daftar ikon, jendela yang terbuka, struktur file system simulasi, clipboard, berbagai pengaturan aplikasi (seperti latar belakang desktop, pengaturan File Explorer, status Night Light, status penguncian taskbar), dan state UI lainnya (seperti visibilitas Start Menu, modal). Menyediakan semua aksi (fungsi) untuk memodifikasi state ini.
    - **`fileSystemStore.js`**: Store yang tampaknya merupakan versi awal atau subset dari fungsionalitas file system. Sebagian besar logikanya kini tampaknya terintegrasi dan diperluas dalam `desktopStore.js`. Mungkin perlu direfaktor atau dihapus jika semua fungsionalitasnya sudah tercakup di `desktopStore.js`.
- **`assets/`**: Direktori untuk aset statis seperti gambar. Saat ini hanya berisi `react.svg`.

## Alur Kerja Aplikasi

1.  **Inisialisasi**:
    *   Eksekusi dimulai dari `main.jsx` yang merender komponen `App` ke dalam elemen HTML dengan ID `root`.
    *   `App.jsx` kemudian merender komponen utama `Desktop.jsx`.
    *   Pada saat yang sama, `desktopStore.js` (store Zustand) diinisialisasi. Store ini mendefinisikan state awal untuk seluruh aplikasi, seperti:
        *   `initialIcons`: Daftar ikon aplikasi default yang akan muncul di desktop (File Explorer, Terminal, Settings, dll.) beserta posisi awalnya.
        *   `initialFs`: Struktur file system awal yang disimulasikan, termasuk direktori dan file contoh.
        *   `initialCwd`: Current Working Directory (CWD) awal untuk terminal atau File Explorer.
        *   Pengaturan default lainnya seperti `fileExplorerSettings`, `desktopBackground`, `pinnedAppIds`.
    *   `desktopStore.js` menggunakan `persist` middleware dari Zustand. Ini berarti sebagian dari state (yang ditentukan dalam `partialize`) akan secara otomatis disimpan ke `localStorage` browser. Ketika aplikasi dimuat kembali, state yang tersimpan ini akan "direhidrasi" (`onRehydrateStorage` dan `_rehydrate` menangani logika tambahan saat data dimuat kembali), sehingga preferensi pengguna dan data seperti struktur FS dapat bertahan antar sesi.

2.  **Interaksi Pengguna**:
    *   **Desktop (`Desktop.jsx`)**:
        *   Menampilkan ikon-ikon aplikasi (`DraggableDesktopIcon.jsx`). Pengguna dapat:
            *   Mengklik dua kali ikon: Ini memicu `openWindow` di `desktopStore` untuk membuka aplikasi terkait.
            *   Menggeser ikon: Posisi baru ikon disimpan di store melalui `moveIcon`.
        *   Latar belakang desktop dapat diubah melalui aplikasi Settings.
        *   Klik kanan pada area kosong desktop akan menampilkan `ContextMenu.jsx` dengan opsi seperti "New Folder" atau "New File".
    *   **Taskbar (`Taskbar.jsx`)**:
        *   **Tombol Start**: Mengklik tombol ini akan mentoggle visibilitas `StartMenu.jsx` melalui `toggleStartMenu` di store.
        *   **Ikon Aplikasi**: Menampilkan ikon untuk aplikasi yang di-pin dan aplikasi yang sedang berjalan.
            *   Mengklik ikon: Jika aplikasi berjalan, akan membawa jendela ke depan (`bringToFront`) atau meminimalkan/memulihkan (`toggleMinimize`). Jika tidak berjalan (hanya di-pin), akan membuka aplikasi (`openWindow`).
            *   Klik kanan pada ikon: Menampilkan `ContextMenu.jsx` dengan opsi "Pin/Unpin from taskbar" (dinonaktifkan jika taskbar terkunci) dan "Close window" (jika berjalan).
        *   **Menu Konteks Taskbar**: Klik kanan pada area kosong taskbar menampilkan `ContextMenu.jsx` dengan opsi "Taskbar settings" (membuka aplikasi Settings) dan "Lock/Unlock the taskbar" (`toggleTaskbarLock`).
        *   **System Tray**:
            *   Menampilkan jam dan tanggal (diperbarui setiap detik).
            *   Ikon Wi-Fi: Mengklik membuka/menutup `WifiPanel.jsx`.
            *   Ikon Volume: Mengklik membuka/menutup `VolumeControl.jsx`.
            *   Area Jam/Tanggal: Mengklik membuka/menutup `DateTimeWidget.jsx` (kalender dan jam detail).
            *   Panel-panel ini (`WifiPanel`, `VolumeControl`, `DateTimeWidget`) diposisikan relatif terhadap ikon pemicunya di system tray.
    *   **Jendela (`Window.jsx`)**:
        *   Setiap aplikasi yang dibuka dirender di dalam sebuah komponen `Window`.
        *   **Header**: Menampilkan judul jendela dan tombol kontrol (minimize, maximize/restore, close).
            *   Mengklik header akan memindahkan fokus ke jendela tersebut (`bringToFront`).
            *   Judul dapat diubah secara dinamis oleh aplikasi di dalamnya (misalnya, TextEditor menampilkan nama file dan status `*` jika belum disimpan).
        *   **Drag & Resize**: Jendela dapat dipindahkan dengan menggeser header (menggunakan `react-draggable`) dan diubah ukurannya dari tepian (menggunakan `react-resizable`). Perubahan posisi dan ukuran disimpan di `desktopStore`.
        *   **Manajemen Fokus**: Jendela yang aktif (diklik terakhir) akan memiliki `zIndex` tertinggi dan muncul di atas jendela lain.
    *   **Start Menu (`StartMenu.jsx`)**:
        *   Menampilkan daftar aplikasi yang tersedia (berdasarkan `icons` dari `desktopStore`).
        *   Mengklik nama aplikasi akan memanggil `openWindow` untuk membuka aplikasi tersebut dan kemudian menutup Start Menu.
    *   **Menu Konteks (`ContextMenu.jsx`)**:
        *   Komponen generik yang ditampilkan saat pengguna melakukan klik kanan pada elemen tertentu (desktop, item File Explorer, taskbar).
        *   Menyediakan daftar aksi yang relevan dengan konteks elemen yang diklik.

3.  **Manajemen State (`desktopStore.js`)**: Ini adalah pusat kendali data aplikasi.
    *   **Icons**: Array objek, masing-masing merepresentasikan ikon di desktop. Setiap objek berisi `id`, `label` (nama aplikasi), `icon` (string identifier untuk komponen ikon React Icon), dan `position` (`{x, y}`).
        *   Fungsi terkait: `moveIcon`.
    *   **Windows**: Array objek, masing-masing merepresentasikan jendela yang terbuka. Setiap objek berisi `id` (unik), `iconId` (menghubungkan ke aplikasi), `title`, `zIndex`, `width`, `height`, `x`, `y` (posisi), `minimized` (boolean), `maximized` (boolean), `previousState` (untuk menyimpan ukuran/posisi sebelum maximize), dan `context` (objek untuk melewatkan data spesifik aplikasi ke komponen aplikasi, misalnya `filePath` untuk TextEditor).
        *   Fungsi terkait: `openWindow`, `closeWindow`, `bringToFront`, `moveWindow`, `resizeWindow`, `toggleMinimize`, `toggleMaximize`, `resizeAndMoveWindow`, `updateWindowTitle`, `markWindowDirty`, `markWindowClean`.
    *   **File System (FS)**: Objek besar yang mensimulasikan struktur direktori dan file. Kuncinya adalah path absolut.
        *   Direktori: `{ type: 'directory', content: { /* nested files/dirs */ }, size: 0, lastModified: Date }`
        *   File: `{ type: 'file', content: '...', size: 1024, lastModified: Date }`
        *   `cwd`: String yang menyimpan path Current Working Directory.
        *   Fungsi terkait: `resolvePath` (helper untuk normalisasi path), `getNode` (helper untuk mendapatkan node FS), `setCwd`, `listDirectory`, `createDirectory`, `createFile`, `deleteItem`, `renameItem`, `readFile`, `writeFile`, `moveItem`, `copyItem`. Path diselesaikan relatif terhadap CWD atau sebagai path absolut. Operasi FS umumnya mengembalikan `{ success: boolean, error?: string, data?: any }`.
    *   **Clipboard**: Objek yang menyimpan status operasi copy/cut. Berisi `{ operation: 'copy' | 'cut', paths: string[] }`.
        *   Fungsi terkait: `setClipboard`, `clearClipboard`.
    *   **Pengaturan**: Objek yang menyimpan berbagai preferensi pengguna.
        *   `fileExplorerSettings`: `{ defaultView: 'grid' | 'list', showHiddenFiles: boolean }`.
        *   `desktopBackground`: `{ type: string, customUrl?: string | null }`.
        *   `isTaskbarLocked`: `boolean`.
        *   `isNightLightEnabled`: `boolean`.
        *   `settings`: Objek umum untuk pengaturan lain, misalnya `theme`.
        *   Fungsi terkait: `setFileExplorerSetting`, `setDesktopBackground`, `toggleTaskbarLock`, `toggleNightLight`, `updateSettings`, `updateFileExplorerSettings`.
    *   **UI State**:
        *   `isStartMenuOpen`: `boolean`.
        *   `contextMenu`: `{ visible: boolean, x: number, y: number, items: any[], targetId: string | null, targetType: string | null }`.
        *   `confirmationModal`: `{ isOpen: boolean, title: string, message: string, onConfirm: function | null }`. Digunakan untuk menampilkan dialog konfirmasi sebelum aksi destruktif.
        *   `saveAsDialog`: `{ isOpen: boolean, initialPath: string, initialFilename: string, onSave: function | null }`.
        *   `dirtyWindowIds`: Array ID jendela yang memiliki perubahan belum disimpan.
        *   Fungsi terkait: `toggleStartMenu`, (setter untuk contextMenu tidak eksplisit, biasanya di-set langsung di komponen), `showConfirmation`, `hideConfirmation`, `openSaveAsDialog`, `closeSaveAsDialog`.
    *   **Actions (Fungsi)**: Ini adalah metode yang tersedia di store untuk memodifikasi state. Sebagian besar aksi menggunakan `produce` dari Immer: `set(produce(draft => { /* mutasi draft state */ }))`. Ini memastikan bahwa state diperbarui secara immutable tanpa perlu spread operator manual yang rumit.
        *   Contoh penting:
            *   `openWindow(iconId, context)`: Mencari ikon, membuat state jendela baru (menghitung posisi tengah, ID unik, zIndex tertinggi), dan menambahkannya ke array `windows`.
            *   `closeWindow(windowId)`: Menghapus jendela dari array `windows`. Jika jendela "dirty", akan memicu `showConfirmation` terlebih dahulu.
            *   `bringToFront(windowId)`: Menaikkan `zIndex` jendela yang dipilih menjadi yang tertinggi.
            *   Operasi FS (misalnya, `createDirectory(path)`): Memvalidasi path, menemukan node induk, dan memodifikasi struktur `fs` di dalam `produce`.

## Komponen Utama dan Logikanya

### `Desktop.jsx`

*   **Peran**: Komponen ini adalah "panggung" utama aplikasi, mengatur dan menampilkan semua elemen visual tingkat atas.
*   **Rendering Utama**:
    *   `Taskbar.jsx`: Selalu dirender di bagian bawah.
    *   `DraggableDesktopIcon.jsx`: Dirender untuk setiap item dalam array `icons` dari `desktopStore`. Setiap ikon diberi `key`, data ikon (`icon`), handler `onDoubleClick` (memanggil `openWindow` dari store), dan handler `onDragStop` (memanggil `moveIcon` dari store).
    *   `Window.jsx`: Dirender untuk setiap item dalam array `windows` dari `desktopStore`, tetapi *hanya jika jendela tersebut tidak diminimalkan*. Menggunakan `AnimatePresence` dari Framer Motion untuk menganimasikan kemunculan dan kehilangan jendela. Setiap jendela diberi `key` unik, propertinya (ID, judul, zIndex, dll.), dan children berupa komponen aplikasi yang sesuai.
    *   `StartMenu.jsx`: Dirender kondisional berdasarkan `isStartMenuOpen` dari store, juga di dalam `AnimatePresence`.
*   **Fungsi Internal Utama**:
    *   `handleIconDoubleClick(iconId)`: Dipicu saat ikon di-double-klik. Memanggil `openWindow(iconId)` dari `desktopStore` untuk membuat dan menampilkan jendela baru untuk aplikasi tersebut.
    *   `handleIconDragStop(iconId, position)`: Dipicu saat pengguna selesai menggeser ikon. Memanggil `moveIcon(iconId, position)` dari `desktopStore` untuk memperbarui dan menyimpan posisi baru ikon.
    *   `getAppComponent(iconId, context)`: Fungsi helper yang menerima `iconId` (misalnya, 'file-explorer', 'terminal') dan `context` (data opsional untuk aplikasi). Menggunakan `switch` statement untuk mengembalikan instance komponen aplikasi yang benar (misalnya, `<FileExplorer context={context}/>`, `<Terminal context={context}/>`). Komponen aplikasi ini akan menjadi `children` dari komponen `Window`.
*   **Manajemen Latar Belakang**:
    *   Membaca state `desktopBackground` dari `desktopStore`.
    *   Secara dinamis mengatur `className` (untuk gradient atau warna solid yang telah ditentukan) atau `style` (untuk gambar kustom) pada div container utama (`desktop-container`) untuk mengubah tampilan latar belakang.
*   **Night Light**: Menerapkan class `night-light-active` ke `desktop-container` jika `isNightLightEnabled` true, yang memicu filter CSS untuk efek cahaya malam. (Catatan: `NightLightOverlay.jsx` sendiri di-comment pemanggilannya, efek utama melalui CSS pada container).
*   **Notifikasi Global**: Merender komponen `<Toaster />` dari `react-hot-toast`, yang berfungsi sebagai container untuk semua notifikasi toast yang muncul di aplikasi. Posisi dan opsi default toast dikonfigurasi di sini.
*   **Modal Global**: Merender `ConfirmModal` dan `SaveAsDialog`. Visibilitas dan konten modal ini dikontrol oleh state masing-masing di `desktopStore` (`confirmationModal`, `saveAsDialog`).

### `Taskbar.jsx`

*   **Peran**: Merepresentasikan taskbar sistem operasi, menyediakan akses ke Start Menu, aplikasi yang berjalan/di-pin, dan system tray.
*   **Struktur**:
    *   **Tombol Start**: Sebuah tombol sederhana yang, saat diklik, memanggil `toggleStartMenu()` dari `desktopStore` untuk membuka atau menutup `StartMenu`.
    *   **Area Aplikasi**:
        *   Menampilkan daftar tombol, satu untuk setiap aplikasi yang di-pin (`pinnedAppIds`) dan setiap jendela yang terbuka (`windows`). Logika penggabungan memastikan tidak ada duplikasi jika aplikasi yang di-pin juga berjalan.
        *   Setiap tombol menampilkan ikon aplikasi (diambil melalui `getIconComponent` dari `desktopStore`) dan labelnya.
        *   Indikator visual (garis kecil di bawah ikon) menunjukkan aplikasi yang sedang berjalan, dengan gaya berbeda jika aplikasi tersebut aktif dan tidak diminimalkan.
        *   Menggunakan `AnimatePresence` dan `motion.button` untuk animasi saat tombol aplikasi ditambahkan atau dihapus dari taskbar.
    *   **System Tray**:
        *   **Ikon Wi-Fi**: Tombol dengan ikon Wi-Fi. Mengklik memanggil `handleWifiClick`.
        *   **Ikon Volume**: Tombol dengan ikon volume. Mengklik memanggil `handleVolumeClick`.
        *   **Area Jam & Tanggal**: Menampilkan waktu (HH:MM) dan tanggal (misalnya, Sen, 1 Jan 2024). Area ini juga merupakan tombol yang memanggil `handleDateTimeClick`.
*   **Fungsi Internal Utama**:
    *   `handleTaskbarButtonClick(windowId, iconId)`: Dipicu saat tombol aplikasi di taskbar diklik.
        *   Jika `windowId` ada (aplikasi berjalan):
            *   Jika jendela adalah jendela aktif dan tidak diminimalkan, maka minimalkan (`toggleMinimize(windowId)`).
            *   Jika tidak, bawa jendela ke depan (`bringToFront(windowId)`).
        *   Jika `windowId` null (aplikasi di-pin tapi tidak berjalan): Buka jendela baru (`openWindow(iconId)`).
    *   `handleTaskbarButtonContextMenu(e, iconId, windowId)`: Dipicu saat klik kanan pada tombol aplikasi di taskbar.
        *   Membangun daftar item untuk `ContextMenu` berdasarkan status aplikasi (di-pin, berjalan) dan status penguncian taskbar.
        *   Opsi meliputi: Label aplikasi (disabled), "Pin/Unpin from taskbar" (dinonaktifkan jika `isTaskbarLocked`), "Close window" (jika berjalan).
        *   Menampilkan `ContextMenu` di dekat kursor.
    *   `handleTaskbarContextMenu(e)`: Dipicu saat klik kanan pada area kosong taskbar.
        *   Menampilkan `ContextMenu` dengan opsi "Taskbar settings" (membuka aplikasi Settings) dan "Lock/Unlock the taskbar".
    *   `handleWifiClick`, `handleVolumeClick`, `handleDateTimeClick`: Mentoggle visibilitas panel masing-masing (`WifiPanel`, `VolumeControl`, `DateTimeWidget`) dan menutup panel lain yang mungkin terbuka.
    *   **Manajemen Clock & Date**: `useEffect` digunakan untuk mengatur interval yang memperbarui state `currentTime` setiap detik, yang kemudian diformat untuk ditampilkan di system tray.
*   **Panel System Tray**: `VolumeControl`, `WifiPanel`, dan `DateTimeWidget` dirender kondisional di dalam `AnimatePresence` berdasarkan state visibilitasnya (misalnya, `isVolumePanelOpen`). `anchorRef` dilewatkan ke panel-panel ini agar mereka dapat memposisikan diri relatif terhadap ikon pemicunya.

### `Window.jsx`

*   **Peran**: Komponen serbaguna yang membungkus konten setiap aplikasi, menyediakan fungsionalitas jendela standar.
*   **Struktur & Fungsionalitas**:
    *   **Draggable & Resizable**:
        *   Menggunakan `<Draggable>` dari `react-draggable` (dengan `nodeRef` untuk kompatibilitas StrictMode) untuk membuat seluruh jendela dapat dipindahkan dengan menggeser area header (`handle: '.window-header'`). Gerakan dibatasi oleh parent (`bounds: 'parent'`). Dragging dinonaktifkan jika jendela dimaksimalkan.
        *   Menggunakan `<ResizableBox>` dari `react-resizable` untuk memungkinkan perubahan ukuran dari semua sisi dan sudut (`resizeHandles`). Ukuran dibatasi oleh `minConstraints` dan `maxConstraints`.
    *   **Header (`.window-header`)**:
        *   Menampilkan `title` jendela.
        *   Berisi tiga tombol kontrol:
            *   **Minimize**: Memanggil `toggleMinimize(id)` dari store.
            *   **Maximize/Restore**: Memanggil `toggleMaximize(id)` dari store. Ikon berubah antara maximize dan restore.
            *   **Close**: Memanggil `closeWindow(id)` dari store.
        *   Fungsi `handleButtonClick(e, action)` digunakan untuk memastikan `e.stopPropagation()` dipanggil sebelum menjalankan aksi tombol, mencegah event klik memicu `bringToFront` secara tidak sengaja.
    *   **Konten Aplikasi**: `children` (yang merupakan komponen aplikasi seperti `<FileExplorer />`) dirender di dalam area konten.
        *   `React.cloneElement` digunakan untuk melewatkan `context` tambahan ke `children`, termasuk `id` jendela dan callback `handleTitleUpdate`.
*   **Fungsi Internal Utama**:
    *   `handleResize(event, { size, handle })`: Dipicu oleh `ResizableBox` saat ukuran diubah. Menghitung `newWidth`, `newHeight`, dan juga `newX`, `newY` yang disesuaikan berdasarkan handle mana yang digunakan (misalnya, jika resize dari kiri, `x` akan berubah). Kemudian memanggil `resizeAndMoveWindow(id, { ... })` dari store dengan nilai-nilai baru.
    *   `handleTitleUpdate(newTitle)`: Callback yang dilewatkan ke komponen anak. Ketika anak memanggilnya, fungsi ini memanggil `updateWindowTitle(id, newTitle)` dari store untuk memperbarui judul jendela di state global.
*   **Manajemen Fokus & State**:
    *   Mengklik di mana saja pada jendela (kecuali tombol header) akan memanggil `bringToFront(id)` untuk memastikan jendela tersebut menjadi aktif dan memiliki `zIndex` tertinggi.
    *   Posisi, ukuran, status minimized/maximized, dan `zIndex` diterima sebagai props dari `desktopStore` dan digunakan untuk merender jendela.
*   **Animasi**: Dibungkus dengan `<motion.div>` dan menggunakan `windowVariants` (opacity dan scale) untuk animasi saat jendela dibuka atau ditutup, dikelola oleh `AnimatePresence` di `Desktop.jsx`.

### `DraggableDesktopIcon.jsx` & `DesktopIcon.jsx`

*   **`DesktopIcon.jsx` (Presentasional)**:
    *   **Peran**: Menampilkan visual satu ikon aplikasi di desktop.
    *   **Props**: Menerima `IconComponent` (komponen ikon React yang sudah di-resolve), `label` (string nama aplikasi), dan `onDoubleClick` (fungsi callback).
    *   **Rendering**: Merender sebuah tombol (`<button>`) yang berisi:
        *   `IconComponent` (atau placeholder `?` jika tidak ada).
        *   `label` teks di bawah ikon.
    *   Event `onDoubleClick` ditangani langsung oleh tombol. Styling dasar dan hover/focus juga diterapkan.
*   **`DraggableDesktopIcon.jsx` (Fungsional)**:
    *   **Peran**: Membuat `DesktopIcon` dapat digeser (draggable) di area desktop.
    *   **Props**: Menerima objek `icon` (berisi `id`, `label`, `icon` (string identifier), `position`), `onDoubleClick`, dan `onDragStop`.
    *   **Implementasi**:
        *   Menggunakan `getIconComponent(icon.icon)` dari `desktopStore` untuk mendapatkan komponen React Icon aktual berdasarkan string identifier yang disimpan di state.
        *   Membungkus `DesktopIcon` dengan komponen `<Draggable>` dari `react-draggable`.
        *   `nodeRef` digunakan untuk kompatibilitas Draggable dengan React StrictMode.
        *   `bounds="parent"` membatasi gerakan ikon agar tetap di dalam kontainer desktop.
        *   `defaultPosition` diatur dari `icon.position` yang berasal dari store.
        *   `onStop` callback dari Draggable dipetakan ke `onDragStop` prop, yang kemudian akan memanggil `moveIcon` di `desktopStore` untuk menyimpan posisi baru.
        *   Meneruskan `IconComponent` yang sudah di-resolve dan `label` ke `DesktopIcon`.

### `StartMenu.jsx`

*   **Peran**: Menampilkan menu Start saat tombol Start di taskbar diklik.
*   **Fungsionalitas**:
    *   Dikontrol oleh `isStartMenuOpen` dari `desktopStore`.
    *   `useEffect` digunakan untuk menambahkan event listener `mousedown` ke dokumen. Jika pengguna mengklik di luar area Start Menu (dan bukan pada Taskbar itu sendiri, untuk mencegah penutupan langsung saat membuka), maka `toggleStartMenu(false)` akan dipanggil untuk menutup menu. Listener ini dibersihkan saat komponen unmount.
    *   Mengambil daftar `icons` dari `desktopStore` untuk menampilkan semua aplikasi yang tersedia.
    *   Setiap aplikasi dirender sebagai tombol. Saat diklik (`handleAppClick`), `openWindow(iconId)` dipanggil untuk membuka aplikasi tersebut, dan kemudian Start Menu ditutup (`toggleStartMenu(false)`).
    *   Ikon aplikasi juga ditampilkan di samping labelnya menggunakan `getIconComponent`.
*   **Animasi**: Menggunakan `<motion.div>` dengan `menuVariants` (opacity dan translasi y) untuk animasi slide-up saat muncul dan hilang. `AnimatePresence` di `Desktop.jsx` mengelola siklus hidup animasi ini.

### `ContextMenu.jsx`

*   **Peran**: Komponen UI generik yang dapat digunakan kembali untuk menampilkan menu klik kanan (konteks).
*   **Props**:
    *   `x`, `y`: Koordinat (relatif terhadap viewport jika `positionClass="fixed"`, atau relatif terhadap parent jika `positionClass="absolute"`) di mana menu harus muncul.
    *   `items`: Array objek, di mana setiap objek mendefinisikan satu item menu. Item bisa berupa:
        *   Aksi: `{ label: string, onClick: function, disabled?: boolean }`
        *   Pemisah: `{ separator: true }`
    *   `onClose`: Fungsi callback yang dipanggil saat menu harus ditutup.
    *   `positionClass`: Kelas CSS untuk positioning (default "absolute").
    *   `verticalOrigin`: "top" atau "bottom", untuk mencoba memposisikan menu di atas atau di bawah titik klik (implementasi `bottom` saat ini mungkin memerlukan penyesuaian lebih lanjut).
*   **Fungsionalitas**:
    *   `useEffect` digunakan untuk menutup menu secara otomatis jika pengguna:
        *   Mengklik di luar area menu (`mousedown` listener pada dokumen).
        *   Menekan tombol `Escape` (`keydown` listener pada dokumen).
    *   Menu dirender sebagai `div` dengan `ul` dan `li` untuk setiap item.
    *   Tombol item menu akan memanggil `item.onClick()` saat diklik.
    *   Posisi menu diatur menggunakan `style={{ top: y, left: x }}` (atau `bottom`, `left` jika `verticalOrigin="bottom"`).
    *   `onContextMenu={(e) => e.preventDefault()}` pada div utama mencegah munculnya menu konteks browser di atas menu konteks aplikasi.

### Modal Dialogs (`modal/`)

Semua modal umumnya mengikuti pola: dikontrol oleh state `isOpen` (seringkali dari `desktopStore`), memiliki fungsi `onClose` untuk menutupnya, dan menggunakan `AnimatePresence` (biasanya di komponen pemanggil seperti `Desktop.jsx` atau di dalam modal itu sendiri jika lebih kompleks seperti `SaveAsDialog`) untuk animasi.

*   **`Modal.jsx` (Dasar)**:
    *   Menyediakan kerangka dasar: overlay gelap semi-transparan (`backdrop-blur-sm`) yang menutupi seluruh layar dan kontainer modal di tengah.
    *   Menutup modal jika overlay diklik. Menghentikan propagasi klik di dalam kontainer modal agar tidak menutup modal secara tidak sengaja.
    *   Menampilkan `title` dan `children` (konten modal).

*   **`InputModal.jsx`**:
    *   Digunakan untuk meminta input teks sederhana dari pengguna.
    *   Props: `isOpen`, `onClose`, `title`, `label` (untuk input field), `initialValue`, `onSubmit` (callback dengan nilai input), `submitText` (teks tombol submit), `directoryHint` (opsional, untuk menampilkan path saat membuat file/folder), `errorMessage`.
    *   Menggunakan `<form>` dan `<input type="text">`. `onSubmit` dipanggil saat form disubmit.
    *   Menampilkan pesan error jika ada.

*   **`ConfirmModal.jsx`**:
    *   Digunakan untuk dialog konfirmasi ya/tidak.
    *   Props: `isOpen`, `onClose`, `onConfirm` (callback saat tombol konfirmasi diklik), `title`, `message`, `confirmText`, `cancelText`.
    *   Menampilkan ikon peringatan, judul, pesan, dan dua tombol (Konfirmasi dan Batal).
    *   `onConfirm()` dan `onClose()` dipanggil saat tombol Konfirmasi diklik. `onClose()` dipanggil saat Batal diklik atau Escape ditekan.

*   **`SaveAsDialog.jsx`**: Modal yang paling kompleks.
    *   **Peran**: Menyediakan UI untuk menyimpan file dengan nama dan lokasi baru.
    *   **State Internal**: `selectedPath` (direktori yang dipilih di tree), `fileName`, `errorMessage`, `isNewFolderModalOpen`.
    *   **Struktur & Fungsionalitas**:
        *   **Header**: Judul "Save As".
        *   **Path Display & Navigasi**:
            *   Menampilkan path direktori yang sedang dipilih (`selectedPath`).
            *   Tombol "Go Up" (`FiArrowUp`) untuk navigasi ke direktori induk.
        *   **Directory Tree (`DirectoryNode.jsx`)**:
            *   Komponen rekursif yang menampilkan struktur direktori dari `desktopStore.fs`.
            *   Direktori dapat diexpand/collapse. Hanya menampilkan direktori dalam tree ini.
            *   Mengklik direktori akan mengubah `selectedPath`.
            *   Item diurutkan (direktori dulu, lalu alfabetis).
        *   **File Name Input**: Input field untuk memasukkan nama file. Validasi dasar (tidak boleh kosong, tidak boleh mengandung slash).
        *   **Error Message**: Menampilkan pesan error terkait input nama file.
        *   **Footer**:
            *   Tombol "New Folder": Membuka `InputModal` untuk membuat direktori baru di `selectedPath`. Hasilnya (sukses/gagal) akan menampilkan toast.
            *   Tombol "Cancel": Memanggil `closeSaveAsDialog()` dari store.
            *   Tombol "Save": Memanggil `handleSaveClick()`.
    *   **Fungsi Kunci**:
        *   `handleSaveClick()`:
            1.  Memvalidasi nama file.
            2.  Menyusun `fullPath` tujuan.
            3.  Menggunakan `getNode(fs, fullPath)` dari store untuk memeriksa apakah file sudah ada.
            4.  Jika sudah ada, memanggil `showConfirmation()` dari store untuk meminta konfirmasi menimpa.
            5.  Jika tidak ada atau dikonfirmasi, memanggil `onSave(fullPath)` (callback yang diberikan saat dialog dibuka, biasanya ini adalah `performSave` dari `TextEditor`).
        *   `handleNewFolderSubmit(name)`: Dipanggil oleh modal "New Folder". Membuat direktori baru menggunakan `createDirectory` dari store.
    *   Dikontrol oleh state `saveAsDialog` di `desktopStore` (`isOpen`, `initialPath`, `initialFilename`, `onSave`). `openSaveAsDialog` dan `closeSaveAsDialog` adalah aksi di store.
    *   Menggunakan `AnimatePresence` dan `motion.div` untuk animasi.

*   **`SimpleDisplayModal.jsx`**:
    *   Modal dasar untuk menampilkan informasi read-only.
    *   Props: `isOpen`, `onClose`, `title`, `children`.
    *   Digunakan oleh File Explorer untuk menampilkan properti file/folder.

### System Tray Components (`systemTray/`)

Komponen-komponen ini umumnya:
- Dirender kondisional di `Taskbar.jsx` menggunakan `AnimatePresence`.
- Diposisikan secara fixed relatif terhadap ikon pemicu di system tray (`anchorRef`).
- Menutup otomatis jika pengguna mengklik di luar area panel atau ikon pemicunya (menggunakan `useEffect` untuk menambahkan event listener `mousedown` ke dokumen).
- Menggunakan `motion.div` untuk animasi.

*   **`DateTimeWidget.jsx`**:
    *   Menampilkan jam digital besar, tanggal lengkap, dan kalender sederhana untuk bulan saat ini.
    *   Waktu pada jam digital diperbarui setiap detik (`useEffect` dengan `setInterval`) selama panel terbuka.
    *   Kalender menyorot tanggal hari ini. (Tidak ada fungsionalitas navigasi bulan).

*   **`VolumeControl.jsx`**:
    *   Menyediakan slider (`<input type="range">`) untuk mengatur tingkat volume (0-100) dan tombol untuk mute/unmute.
    *   State `volume` dan `isMuted` dikelola secara lokal di dalam komponen ini (simulasi, tidak mengontrol volume sistem sebenarnya).
    *   Ikon berubah antara `FiVolume2` dan `FiVolumeX` berdasarkan status mute/volume.

*   **`WifiPanel.jsx`**:
    *   Menampilkan status koneksi Wi-Fi yang disimulasikan (misalnya, nama jaringan "MyNetwork_5G", "Connected, secured").
    *   Tombol "Network & Internet settings" adalah placeholder.
    *   Ikon Wi-Fi (`FiWifi` atau `FiWifiOff`) ditampilkan berdasarkan status koneksi.

### Aplikasi (`apps/`)

Setiap komponen aplikasi di sini dirancang untuk dirender sebagai `children` di dalam komponen `Window.jsx`. Mereka menerima prop `context` dari `Window.jsx`, yang bisa berisi data seperti `filePath` atau callback seperti `updateTitle`.

*   **`FileExplorer.jsx`**: Salah satu aplikasi paling kompleks.
    *   **Navigasi & Tampilan**:
        *   Mengelola `currentPath` lokal untuk direktori yang sedang dilihat.
        *   `useEffect` mengambil daftar item (`listDirectory(currentPath)`) dari `desktopStore` setiap kali `currentPath` atau `fs` (file system global) berubah.
        *   Tombol "Up" (`FaArrowLeft`) dan klik pada breadcrumb path digunakan untuk navigasi.
        *   Area breadcrumb dapat diklik untuk masuk mode edit path (`isEditingPath`), memungkinkan pengguna mengetik path secara manual. Perubahan path divalidasi dan diterapkan melalui `setCwd` dari store.
        *   **View Modes**:
            *   `viewMode` (state lokal, diinisialisasi dari `fileExplorerSettings.defaultView` di store) bisa 'grid' atau 'list'.
            *   Tombol di toolbar (`FaThLarge`, `FaList`) mengubah `viewMode` dan juga memperbarui `fileExplorerSettings.defaultView` di store.
            *   **Grid View**: Menampilkan item sebagai ikon besar dengan nama di bawahnya.
            *   **List View**: Menampilkan item dalam tabel dengan kolom Name, Type, Size, Date Modified.
    *   **Seleksi Item**:
        *   `selectedItemNames` (Set) menyimpan nama item yang dipilih.
        *   `lastClickedIndex` digunakan untuk mendukung seleksi dengan Shift.
        *   `handleItemClick(e, itemName, index)`: Logika kompleks untuk menangani klik tunggal, Ctrl+klik (toggle seleksi), dan Shift+klik (seleksi range).
    *   **Operasi File & Folder**:
        *   **Double Click**: Pada direktori akan navigasi, pada file akan mencoba membukanya (Text Editor untuk `.txt`, Image Viewer untuk gambar, toast error untuk tipe lain). `openWindow` dari store digunakan.
        *   **Menu Konteks**:
            *   Pada item: Opsi Copy, Cut, Rename, Delete, Properties.
            *   Pada background: Opsi New Folder, New File, Paste (jika clipboard tidak kosong).
        *   **Modals**: Menggunakan `InputModal` untuk New Folder/File/Rename, `ConfirmModal` untuk Delete, `SimpleDisplayModal` untuk Properties. Aksi modal ini (misalnya, `handleCreateFolderSubmit`) akan memanggil fungsi yang sesuai dari `desktopStore` (`createDirectory`, `renameItem`, dll.).
    *   **Drag & Drop**:
        *   **Internal (Main View)**: Item dapat di-drag (`handleDragStart`) dan di-drop ke folder lain di view yang sama (`handleDrop`). `draggedItemNames` dan `dragOverFolderName` melacak status drag.
        *   **Ke Sidebar**: Item dapat di-drag dari main view dan di-drop ke node direktori di `FileTreeSidebar.jsx` (`handleSidebarDrop`).
        *   **Dari OS**: File dari sistem operasi host dapat di-drag ke area File Explorer (`handleOsDragEnter`, `handleOsDragOver`, `handleOsDragLeave`, `handleOsDrop`).
            *   Untuk file gambar (`image/*`) dan teks (`text/plain`, `.txt`), konten file dibaca menggunakan `FileReader` (`readAsDataURL` untuk gambar, `readAsText` untuk teks) dan disimpan sebagai `content` file baru di FS simulasi menggunakan `createFile` dari store.
            *   Untuk file lain, hanya entri file dengan metadata ukuran yang dibuat.
    *   **Clipboard**: `handleCopy` dan `handleCut` memanggil `setClipboard` dari store. `handlePaste` memanggil `copyItem` atau `moveItem` dari store tergantung operasi di clipboard.
    *   **Pencarian**:
        *   Input pencarian memperbarui `rawSearchTerm`. `useEffect` dengan timeout (debounce) memperbarui `debouncedSearchTerm`.
        *   `filteredItems` dihitung berdasarkan `debouncedSearchTerm` dan `fileExplorerSettings.showHiddenFiles`.
    *   **Sidebar**: Merender `<FileTreeSidebar />`, melewatkan `currentPath`, `onNavigate` (untuk memperbarui `currentPath` File Explorer saat sidebar diklik), `draggedItemNames`, dan `onDropItem` (untuk menangani drop dari main view ke sidebar).
    *   **Status Bar**: Menampilkan jumlah item yang dipilih atau jumlah total item (dan filter pencarian jika aktif).

*   **`FileTreeSidebar.jsx` (`TreeNode` rekursif)**:
    *   **Peran**: Menampilkan hierarki direktori dari file system simulasi sebagai tree view.
    *   **`TreeNode` (Komponen Rekursif)**:
        *   Merepresentasikan satu node (direktori) dalam tree.
        *   Menampilkan ikon folder (`FaFolder`) dan nama direktori.
        *   Ikon expand/collapse (`FaChevronRight`/`FaChevronDown`) jika node dapat diexpand.
        *   Menyorot node yang `isActive` (sesuai dengan `currentPath` File Explorer).
        *   `handleNavigate`: Dipanggil saat node diklik, memicu `onNavigate(nodePath)` (yang akan mengubah `currentPath` di `FileExplorer`).
        *   `handleToggle`: Dipanggil saat ikon expand/collapse diklik, memanggil `toggleNode(nodePath)` di `FileTreeSidebar`.
        *   **Drag & Drop Target**: Node dapat menjadi target drop dari item yang di-drag di `FileExplorer`.
            *   `handleDragOver`, `handleDragLeave`, `handleDrop`: Mirip dengan di File Explorer, tapi di sini node adalah target. `onDropItem(sourceNames, nodePath)` (dari File Explorer) dipanggil.
    *   **`FileTreeSidebar` (Komponen Utama Sidebar)**:
        *   Mengelola `expandedNodes` (path mana saja yang sedang diexpand), `treeData` (cache data direktori yang sudah diambil: `{ path: { items: { /* sub-dirs only */ } } }`), dan `loadingPaths`.
        *   `fetchNodeData(nodePath, forceRefetch)`: Mengambil daftar direktori dari `listDirectory(nodePath)` store, memfilter hanya subdirektori, dan menyimpannya di `treeData`.
        *   `toggleNode(nodePath)`: Mengubah status expand/collapse node. Jika node diexpand untuk pertama kali, `fetchNodeData` dipanggil.
        *   `useEffect` [fs, expandedNodes]: Merefresh data untuk semua node yang sedang diexpand setiap kali `fs` (file system global) berubah. Ini memastikan tree tetap sinkron jika ada perubahan FS dari tempat lain.
        *   `useEffect` [currentPath]: Memastikan `currentPath` dan semua direktori leluhurnya di tree diexpand dan datanya dimuat.

*   **`Terminal.jsx`**:
    *   **Peran**: Mensimulasikan antarmuka baris perintah (CLI).
    *   **State**: `history` (array output yang ditampilkan), `input` (teks yang sedang diketik pengguna), `commandHistory` (array perintah yang pernah dieksekusi untuk navigasi), `historyIndex` (untuk navigasi `commandHistory`).
    *   **Input & Output**:
        *   Input pengguna ditangani oleh `<input type="text">`.
        *   Output perintah dan prompt sebelumnya disimpan dalam state `history` dan dirender sebagai daftar. Setiap baris output dianimasikan menggunakan `motion.div`.
        *   `endOfHistoryRef` dan `useEffect` digunakan untuk auto-scroll ke output terbaru, tapi hanya jika pengguna sudah berada di dekat bagian bawah.
    *   **Pemrosesan Perintah (`handleInputSubmit` saat Enter)**:
        1.  Perintah yang diketik (`input`) dipecah menjadi `command` dan `args`.
        2.  Ditambahkan ke `commandHistory`.
        3.  Prompt dan perintah yang dieksekusi ditambahkan ke `history` visual.
        4.  `switch (command)` menangani logika untuk setiap perintah yang didukung:
            *   `help`: Menampilkan daftar perintah.
            *   `clear`: Mengosongkan `history`.
            *   `pwd`: Menampilkan `cwd` dari store.
            *   `ls [path]`: Memanggil `listDirectory` dari store. Memformat output untuk menampilkan tipe (d/-), tanggal modifikasi, ukuran (menggunakan helper `formatBytes`, `formatDate`), dan nama. Direktori diurutkan terlebih dahulu.
            *   `cd <path>`: Memanggil `setCwd` dari store.
            *   `mkdir <path>`, `touch <path>`, `rm <path>`, `cat <path>`, `mv <source> <dest>`, `cp <source> <dest>`: Memanggil aksi FS yang sesuai dari `desktopStore`. Hasil (sukses/error) ditambahkan ke `history`. Toast juga digunakan untuk beberapa operasi sukses (misalnya, mkdir, touch).
            *   `echo [...text]`: Mencetak teks argumen.
            *   Default: "Command not found".
        5.  `input` dikosongkan.
    *   **Navigasi Histori Perintah**: Panah Atas/Bawah di input field akan mengisi input dengan perintah dari `commandHistory`.
    *   **Auto-Completion (Tab)**:
        1.  Mendeteksi apakah pengguna sedang mengetik nama perintah atau argumen (path).
        2.  Jika nama perintah: Mencocokkan dengan `KNOWN_COMMANDS`.
        3.  Jika argumen: Mencocokkan dengan item di `listDirectory(cwd)`.
        4.  Jika satu match: Melengkapi input, menambahkan spasi atau `/` (untuk direktori).
        5.  Jika banyak match:
            *   Tab pertama: Melengkapi dengan prefix terpanjang yang sama.
            *   Tab kedua (jika prefix tidak berubah): Menampilkan semua match di output.
    *   Klik pada area terminal akan memfokuskan input field.

*   **`Settings.jsx`**:
    *   **Peran**: Menyediakan antarmuka untuk mengubah berbagai pengaturan aplikasi.
    *   **Struktur**: Layout dua kolom: sidebar navigasi di kiri, area konten di kanan.
    *   **Sidebar Navigasi**:
        *   `activeSection` (state lokal) melacak bagian pengaturan mana yang sedang aktif.
        *   Daftar `sections` (array objek: `id`, `label`, `icon`, `color`) digunakan untuk merender tombol navigasi.
        *   Mengklik tombol akan mengubah `activeSection`.
    *   **Area Konten (`renderSectionContent()`)**: Menggunakan `switch (activeSection)` untuk merender konten yang sesuai.
        *   **Display**:
            *   **Background**: Pilihan latar belakang (gradient, solid, custom). Mengklik pilihan akan memanggil `setDesktopBackground` dari store. Untuk custom image, tombol "Unggah Gambar" memicu input file tersembunyi. `handleFileChange` membaca file gambar sebagai Data URL, memvalidasi tipe dan ukuran, lalu memanggil `setDesktopBackground`. Ada juga tombol untuk menghapus background kustom (kembali ke default).
            *   **Night Light**: Toggle switch untuk mengaktifkan/menonaktifkan `isNightLightEnabled` di store via `toggleNightLight`.
        *   **Taskbar**:
            *   **Lock Taskbar**: Toggle switch untuk mengubah `isTaskbarLocked` di store via `toggleTaskbarLock`.
        *   **File Explorer**:
            *   **Default View**: Radio button (Grid/List) untuk mengubah `fileExplorerSettings.defaultView` di store via `setFileExplorerSetting`.
            *   **Show Hidden Files**: Toggle switch untuk mengubah `fileExplorerSettings.showHiddenFiles`.
        *   **Account**: Hanya menampilkan nama pengguna placeholder.
        *   **About**: Menampilkan informasi versi dan kredit.
    *   Semua perubahan pengaturan langsung memanggil aksi yang sesuai di `desktopStore` untuk memperbarui state global dan (jika dikonfigurasi) dipersisten.

*   **`TextEditor.jsx`**:
    *   **Peran**: Aplikasi editor teks dasar.
    *   **State Utama**: `currentFilePath` (path file yang sedang diedit, null jika baru), `content` (isi teks), `isLoading`, `error`, `isDirty` (apakah ada perubahan belum disimpan), `lineCount`, `cursorPosition`.
    *   **Loading File (`loadFile`, dipanggil di `useEffect` saat `currentFilePath` berubah)**:
        *   Jika `currentFilePath` null (file baru): `content` kosong, `isDirty` false.
        *   Jika `currentFilePath` ada: Memanggil `readFile(currentFilePath)` dari store.
            *   Sukses: Set `content`, `isDirty` false.
            *   Gagal: Set `error`, tampilkan toast.
        *   Setelah loading, `updateEditorState` dipanggil untuk mengupdate nomor baris dan posisi kursor.
    *   **Editing**:
        *   `<textarea>` digunakan untuk input teks. `onChange` memperbarui `content`.
        *   `handleContentChange`: Memperbarui `content`. Jika ini perubahan pertama, set `isDirty` true dan panggil `markWindowDirty(windowId)` dari store. Memanggil `updateEditorState`.
    *   **Line Numbers & Cursor Position**:
        *   `updateEditorState`: Menghitung jumlah baris dari `textAreaRef.current.value.split('\\n').length` dan posisi kursor menggunakan helper `getCursorPosition`.
        *   Area nomor baris (`div` dengan `lineNumbersRef`) di-scroll secara sinkron dengan `<textarea>` menggunakan event listener scroll.
    *   **Saving**:
        *   `handleSave()`:
            *   Jika `currentFilePath` tidak ada (file baru), panggil `triggerSaveAs()`.
            *   Jika ada, panggil `writeFile(currentFilePath, content)` dari store. Update `isDirty` dan panggil `markWindowClean(windowId)` jika sukses. Tampilkan toast.
        *   `triggerSaveAs()`: Memanggil `openSaveAsDialog` dari store, melewatkan path direktori awal, nama file awal, dan callback `onSave`.
        *   `performSave(fullPath)`: Callback yang dijalankan oleh `SaveAsDialog`. Memanggil `writeFile(fullPath, content)`. Jika sukses, update `currentFilePath`, `isDirty`, `markWindowClean`, dan judul jendela.
    *   **Menu Bar (menggunakan Headless UI `<Menu>`)**:
        *   **File**:
            *   "Save" (Ctrl+S): Memanggil `handleSave`.
            *   "Save As...": Memanggil `triggerSaveAs`.
        *   **Edit**: Placeholder (Undo, Redo, Find).
    *   **Status Bar**: Menampilkan nama file (dengan `*` jika `isDirty`), pesan error (jika ada), atau jumlah kata/karakter dan posisi kursor.
    *   **Judul Jendela Dinamis**: `useEffect` memanggil `updateTitle` (dari `context` `Window.jsx`) setiap kali `currentFilePath` atau `isDirty` berubah, untuk menampilkan `fileName* - Text Editor`.
    *   **Keyboard Shortcuts**: `useEffect` menambahkan listener untuk Ctrl+S/Cmd+S, yang memanggil `handleSave()` jika jendela TextEditor aktif (`windowId === activeWindowId`).

*   **`ImageViewer.jsx`**:
    *   **Peran**: Menampilkan file gambar.
    *   **State Utama**: `imageDataUrl` (Data URL gambar), `isLoading`, `error`, `zoom`, `pan` (`{x,y}`), `isPanning`, `rotation`, `naturalDimensions` (`{width,height}`), `showControls`.
    *   **Loading Gambar**:
        *   Di `useEffect` saat `filePath` (dari `context`) berubah.
        *   Memanggil `readFile(filePath)` dari store. Diasumsikan `readFile` untuk gambar akan mengembalikan Data URL di `result.data`.
        *   Jika sukses, set `imageDataUrl`. Gunakan `new Image()` object dengan `img.onload` untuk mendapatkan `naturalWidth` dan `naturalHeight` gambar sebelum menampilkannya.
        *   Reset zoom, pan, dan rotasi.
    *   **Tampilan Gambar**:
        *   `<img>` tag dengan `src={imageDataUrl}`.
        *   `transform: translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)` digunakan untuk menerapkan zoom, pan, dan rotasi.
        *   Latar belakang checkerboard (`checkerboardStyle`) untuk area di sekitar gambar.
    *   **Kontrol Gambar**:
        *   Dirender sebagai overlay di bagian bawah gambar, muncul saat mouse bergerak (`handleShowControls`) dan hilang setelah timeout (`controlsTimeoutRef`).
        *   Tombol: Zoom In/Out (`handleZoomIn`, `handleZoomOut`), Reset View (`handleResetView`), Rotate Left/Right (`handleRotate`), Fit to Screen (`handleFitToScreen`).
        *   Menampilkan level zoom saat ini dan dimensi asli gambar.
    *   **Interaksi**:
        *   **Zoom**: `handleZoom(factor)` mengubah state `zoom`. Juga dapat di-trigger oleh mouse wheel (`handleWheelZoom`).
        *   **Pan**: `handleMouseDown`, `handleMouseMove`, `handleMouseUpOrLeave` mengelola state `isPanning` dan `pan` untuk memungkinkan pengguna menggeser gambar saat di-zoom. Kursor berubah menjadi grab/grabbing.
        *   **Rotate**: `handleRotate(degrees)` mengubah state `rotation`.
        *   **Fit to Screen**: Menghitung level zoom agar gambar pas di kontainer, lalu set `zoom` dan reset `pan`, `rotation`.
    *   **Keyboard Shortcuts**: `useEffect` menambahkan listener untuk `+`/`-` (zoom), `0`/`r` (reset) jika jendela ImageViewer aktif.

### Utilitas (`utils/`)

*   **`NightLightOverlay.jsx`**:
    *   **Peran**: Menyediakan overlay visual untuk efek "Night Light".
    *   **Fungsionalitas**: Merender sebuah `motion.div` yang menutupi seluruh layar dengan warna oranye semi-transparan jika `isNightLightEnabled` (dari `desktopStore`) adalah `true`. Menggunakan `AnimatePresence` untuk animasi fade in/out.
    *   **Catatan**: Dalam kode `Desktop.jsx` yang dianalisis, pemanggilan langsung komponen ini di-comment. Efek Night Light utama tampaknya dicapai dengan menambahkan class `night-light-active` pada `div.desktop-container` utama, yang kemudian menerapkan filter CSS. Overlay ini mungkin alternatif atau versi sebelumnya.

## Fitur Utama Lainnya

*   **Persistensi State**:
    *   Menggunakan `persist` middleware dari Zustand. Konfigurasi `persist` dalam `desktopStore.js` menentukan:
        *   `name: 'os-simulator-storage'`: Kunci yang digunakan di `localStorage`.
        *   `partialize: (state) => ({ ... })`: Fungsi yang memilih bagian mana dari state yang akan disimpan (misalnya, `icons`, `windows`, `fs`, `cwd`, `settings`, dll., tetapi tidak `clipboard` atau `isStartMenuOpen`).
        *   `onRehydrateStorage`: Callback yang dijalankan setelah state direhidrasi dari `localStorage`. Digunakan untuk menginisialisasi ulang `highestZIndex` dan `nextWindowId` berdasarkan data jendela yang dimuat.
        *   `merge`: Fungsi custom (opsional) untuk menggabungkan state yang dipersisten dengan state awal/saat ini. Di sini, digunakan untuk memastikan state non-persisten seperti `clipboard` tidak tertimpa.
    *   Ini memungkinkan preferensi pengguna, tata letak ikon, dan bahkan file system simulasi untuk tetap ada setelah browser ditutup dan dibuka kembali.

*   **Animasi**:
    *   Framer Motion adalah library utama untuk animasi.
        *   `motion.div`, `motion.button`, dll.: Komponen yang dapat dianimasikan. Properti seperti `initial`, `animate`, `exit`, dan `transition` digunakan untuk mendefinisikan animasi.
        *   `variants`: Objek yang mendefinisikan state animasi yang dapat digunakan kembali (misalnya, `hidden`, `visible`).
        *   `AnimatePresence`: Digunakan untuk menganimasikan komponen saat mereka ditambahkan atau dihapus dari React tree. Sangat penting untuk animasi masuk/keluar jendela, modal, Start Menu, dan panel system tray.
        *   `layout` prop: Digunakan pada `motion.button` di `Taskbar.jsx` untuk menganimasikan perubahan posisi dan ukuran tombol secara otomatis saat item ditambahkan/dihapus.

*   **Notifikasi**:
    *   `react-hot-toast` digunakan untuk menampilkan notifikasi non-blokir.
    *   `<Toaster />` dirender di `Desktop.jsx` sebagai container global.
    *   Fungsi seperti `toast.success('File saved!')`, `toast.error('Error!')`, `toast.loading('Pasting...')` dipanggil dari berbagai tempat (misalnya, setelah operasi FS, saat menyimpan file) untuk memberi feedback kepada pengguna.

*   **Manajemen Fokus dan Keyboard**:
    *   Beberapa aplikasi (Terminal, ImageViewer, TextEditor) memiliki `useEffect` untuk menambahkan event listener `keydown` ke dokumen.
    *   Listener ini biasanya memeriksa apakah jendela aplikasi mereka adalah jendela aktif (`windowId === activeWindowId` dari store) sebelum memproses shortcut keyboard. Ini mencegah shortcut satu aplikasi mengganggu aplikasi lain yang mungkin juga menggunakan shortcut yang sama.
    *   Terminal juga secara eksplisit memfokuskan input field-nya saat area terminal diklik.

*   **Dirty State Management**:
    *   TextEditor melacak perubahan yang belum disimpan menggunakan state lokal `isDirty`.
    *   Ketika `isDirty` menjadi `true`, `markWindowDirty(windowId)` dari `desktopStore` dipanggil, yang menambahkan `windowId` ke array `dirtyWindowIds`.
    *   Ketika file disimpan, `markWindowClean(windowId)` dipanggil.
    *   Di `desktopStore.closeWindow(windowId)`, sebelum menutup, ia memeriksa apakah `windowId` ada di `dirtyWindowIds`. Jika ya, ia memanggil `showConfirmation` untuk menampilkan modal yang bertanya apakah pengguna ingin menutup tanpa menyimpan. Aksi tutup yang sebenarnya hanya dilakukan jika pengguna mengkonfirmasi atau jika jendela tidak dirty.

## Potensi Peningkatan atau Area yang Perlu Diperhatikan

*   **Konsistensi `fileSystemStore.js` vs `desktopStore.js`**: Fungsionalitas file system tampaknya telah banyak dipindahkan ke `desktopStore.js`. `fileSystemStore.js` mungkin perlu dihapus atau direkonsiliasi untuk menghindari duplikasi atau kebingungan. Saat ini, `fileSystemStore.js` masih ada namun tidak banyak digunakan jika dibandingkan dengan `desktopStore.js` yang sudah sangat komprehensif.
*   **Error Handling**: Meskipun ada penanganan error di beberapa tempat (misalnya, saat memuat file, menjalankan perintah terminal, operasi FS), ini bisa diperluas dan distandarisasi. Beberapa error mungkin hanya di-log ke konsol atau menampilkan pesan generik.
*   **Placeholder & Fitur Tidak Lengkap**: Beberapa fitur (seperti beberapa item menu Edit di TextEditor, daftar jaringan lain di WifiPanel, beberapa fungsi lanjutan terminal) masih berupa placeholder atau belum diimplementasikan sepenuhnya.
*   **Performa untuk File System Besar**: Operasi pada file system yang sangat besar (jika disimulasikan) mungkin memerlukan optimasi lebih lanjut, terutama pada rendering `FileExplorer` dan `FileTreeSidebar`. Virtualisasi list/tree bisa menjadi pertimbangan.
*   **Aksesibilitas (a11y)**: Perlu tinjauan lebih lanjut untuk memastikan semua komponen interaktif dapat diakses sepenuhnya menggunakan keyboard dan screen reader, serta memiliki atribut ARIA yang sesuai. Penggunaan Headless UI membantu, tetapi pemeriksaan menyeluruh tetap penting.
*   **Pengujian**: Belum ada informasi mengenai strategi pengujian (unit, integrasi, e2e). Penambahan pengujian akan meningkatkan keandalan kode.
*   **Refaktorisasi**: Beberapa komponen (seperti `FileExplorer.jsx` dan `desktopStore.js`) cukup besar dan mungkin mendapat manfaat dari pemecahan lebih lanjut menjadi modul atau hook kustom yang lebih kecil untuk meningkatkan keterbacaan dan pemeliharaan.

Secara keseluruhan, aplikasi ini adalah simulasi desktop yang cukup komprehensif dengan banyak fitur interaktif yang menunjukkan penggunaan React, Zustand, dan Tailwind CSS secara efektif. Ini adalah basis yang solid untuk eksplorasi lebih lanjut dan penambahan fitur.
