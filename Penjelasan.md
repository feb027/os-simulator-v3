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


## Detail untuk Presentasi per Fitur/Kontributor

Bagian ini bertujuan untuk memberikan poin-poin penting yang bisa digunakan saat mempresentasikan kontribusi pada fitur-fitur spesifik aplikasi.

### 1. `desktopStore.js` (Manajemen State Inti)

*   **Kontributor**: (Siapa pun yang bertanggung jawab utama atas desain dan implementasi store)
*   **Core Responsibilities**:
    *   Sebagai "single source of truth" untuk hampir semua data dinamis dan status UI aplikasi.
    *   Mengelola ikon desktop, jendela yang terbuka (posisi, ukuran, z-index, status), simulasi file system (FS), clipboard, dan berbagai pengaturan pengguna.
    *   Menyediakan semua fungsi (actions) untuk memodifikasi state ini secara aman dan terprediksi.
*   **Key Interactions**: Hampir semua komponen berinteraksi dengan store ini.
    *   **Membaca State**: Komponen menggunakan hook `useDesktopStore(state => state.someValue)` untuk memilih (subscribe) hanya pada bagian state yang mereka butuhkan. Ini mengoptimalkan re-render.
    *   **Memperbarui State**: Komponen memanggil actions yang diekspor dari store (misalnya, `useDesktopStore.getState().openWindow(...)` atau `const openWindow = useDesktopStore(state => state.openWindow); openWindow(...)`).
*   **Teknologi Kunci**: Zustand, Immer, `zustand/middleware/persist`.
    *   **Zustand**: Menyediakan kerangka kerja store yang ringan dan berbasis hook.
    *   **Immer**: Digunakan dalam actions (`set(produce(draft => { ... }))`) untuk pembaruan state immutable yang lebih mudah ditulis dan dibaca.
    *   **Persist Middleware**: Digunakan untuk menyimpan bagian state tertentu (ikon, FS, pengaturan) ke `localStorage` browser, sehingga data tetap ada antar sesi. Logika `onRehydrateStorage` dan `_rehydrate` menangani inisialisasi ulang state non-persisten atau yang memerlukan kalkulasi setelah rehidrasi.
*   **Struktur State Utama (Contoh)**:
    *   `icons`: Array objek ikon (id, label, posisi).
    *   `windows`: Array objek jendela (id, title, size, position, zIndex, context).
    *   `fs`: Objek besar yang merepresentasikan struktur direktori dan file.
    *   `cwd`: Current Working Directory.
    *   `settings`: Objek berisi berbagai pengaturan aplikasi (background, taskbar, night light, dll.).
*   **Poin Presentasi Penting**:
    *   Bagaimana Zustand memudahkan manajemen state dibandingkan solusi lain (misalnya, Redux boilerplate).
    *   Manfaat Immer untuk menjaga immutability tanpa kode yang rumit.
    *   Pentingnya `partialize` dalam middleware `persist` untuk memilih apa yang disimpan.
    *   Contoh alur: pengguna mengklik ikon -> `Desktop.jsx` memanggil `openWindow` -> `openWindow` di store memperbarui state `windows` -> komponen `Desktop.jsx` (yang subscribe ke `windows`) akan re-render untuk menampilkan jendela baru.
    *   Bagaimana operasi file system (misalnya, `createDirectory`, `writeFile`) diimplementasikan sebagai actions yang memodifikasi state `fs`.

### 2. `FileExplorer.jsx` (Aplikasi File Explorer)

*   **Kontributor**: (Siapa yang membuat File Explorer)
*   **Core Responsibilities**:
    *   Menyediakan antarmuka visual untuk berinteraksi dengan file system simulasi yang dikelola di `desktopStore.js`.
    *   Menampilkan isi direktori, navigasi antar direktori, operasi file/folder (create, rename, delete, copy, cut, paste), pencarian, dan drag-and-drop.
*   **Key Interactions with `desktopStore`**:
    *   **Membaca**: `fs` (seluruh file system), `cwd` (current working directory), `fileExplorerSettings` (default view, show hidden files), `clipboard` (untuk operasi paste).
    *   **Actions Dipanggil**: `listDirectory`, `setCwd`, `createDirectory`, `createFile`, `renameItem`, `deleteItem`, `moveItem`, `copyItem`, `setClipboard`, `openWindow` (untuk membuka file), `showConfirmation` (untuk delete), `setFileExplorerSetting`.
*   **Key Internal Logic/State**:
    *   `currentPath`: State lokal untuk path direktori yang sedang ditampilkan.
    *   `items`: State lokal untuk daftar file/folder di `currentPath` (diambil dari `listDirectory`).
    *   `selectedItemNames`: State lokal (Set) untuk melacak item yang dipilih.
    *   `viewMode`: State lokal ('grid' atau 'list').
    *   `debouncedSearchTerm`: Untuk pencarian dengan debounce.
    *   Logika untuk breadcrumb path yang dapat diedit.
    *   Logika kompleks untuk seleksi item (single, ctrl+click, shift+click).
    *   Logika Drag-and-Drop (internal, ke sidebar, dan dari OS host).
        *   Drag dari OS: Menggunakan `FileReader` API untuk membaca konten file gambar dan teks.
*   **User Interaction Flow (Contoh: Membuat Folder Baru)**:
    1.  Pengguna klik kanan di area kosong -> `ContextMenu` muncul.
    2.  Pengguna pilih "New Folder" -> `InputModal` terbuka.
    3.  Pengguna ketik nama folder, tekan Enter -> `handleCreateFolderSubmit` dipanggil.
    4.  `handleCreateFolderSubmit` memanggil action `createDirectory(currentPath, folderName)` dari `desktopStore`.
    5.  `desktopStore` memperbarui state `fs`.
    6.  `FileExplorer` (yang subscribe ke `fs` atau `currentPath`) akan re-render dan menampilkan folder baru (karena `useEffect` yang memanggil `listDirectory` akan berjalan lagi).
*   **Dependencies**: `FileTreeSidebar.jsx`, `ContextMenu.jsx`, `InputModal.jsx`, `ConfirmModal.jsx`, `SimpleDisplayModal.jsx`.
*   **Poin Presentasi Penting**:
    *   Bagaimana data file system dari store ditampilkan dan diperbarui secara reaktif.
    *   Implementasi navigasi (breadcrumb, double-click, up button).
    *   Mekanisme seleksi item (tunggal, ganda, range).
    *   Detail implementasi drag-and-drop (antar item, ke sidebar, dari OS).
    *   Integrasi dengan berbagai modal untuk operasi file.
    *   Penggunaan `FileTreeSidebar` untuk navigasi hierarkis.

### 3. `TextEditor.jsx` (Aplikasi Editor Teks)

*   **Kontributor**: (Siapa yang membuat Text Editor)
*   **Core Responsibilities**:
    *   Menyediakan fungsionalitas dasar untuk membuat, membuka, mengedit, dan menyimpan file teks dalam file system simulasi.
    *   Menampilkan nomor baris dan informasi status (nama file, status dirty, jumlah kata/karakter, posisi kursor).
*   **Key Interactions with `desktopStore`**:
    *   **Membaca**: `activeWindowId` (untuk shortcut), `readFile` (untuk membuka file), `openSaveAsDialog` (untuk "Save As"), `writeFile` (untuk menyimpan).
    *   **Actions Dipanggil**: `readFile`, `writeFile`, `openSaveAsDialog`, `markWindowDirty`, `markWindowClean`, `showConfirmation` (saat menutup jendela dirty).
*   **Key Internal Logic/State**:
    *   `currentFilePath`: Path file yang sedang diedit.
    *   `content`: Isi teks editor (`<textarea>`).
    *   `isDirty`: Apakah ada perubahan yang belum disimpan.
    *   `isLoading`, `error`: Untuk status loading file.
    *   `lineCount`, `cursorPosition`: Untuk ditampilkan di status bar.
    *   `handleContentChange`: Memperbarui `content` dan `isDirty`, memanggil `markWindowDirty`.
    *   `handleSave`: Menyimpan file (atau memicu `triggerSaveAs` jika file baru).
    *   `triggerSaveAs`: Membuka dialog `SaveAsDialog` dari store.
    *   `performSave`: Callback untuk `SaveAsDialog` yang benar-benar melakukan penyimpanan.
    *   Sinkronisasi scroll antara nomor baris dan area teks.
*   **User Interaction Flow (Contoh: Menyimpan File Baru)**:
    1.  Pengguna mengetik di textarea -> `handleContentChange` set `isDirty` true, `markWindowDirty` dipanggil.
    2.  Pengguna pilih "File > Save" atau Ctrl+S.
    3.  `handleSave` dipanggil. Karena `currentFilePath` null, `triggerSaveAs` dipanggil.
    4.  `triggerSaveAs` memanggil `openSaveAsDialog` dari `desktopStore` dengan callback `performSave`.
    5.  `SaveAsDialog` muncul. Pengguna memilih path, nama file, klik "Save".
    6.  Callback `onSave` dari `SaveAsDialog` (yaitu `performSave` di `TextEditor`) dipanggil dengan `fullPath`.
    7.  `performSave` memanggil `writeFile(fullPath, content)` dari `desktopStore`.
    8.  Jika sukses, `currentFilePath` di-update, `isDirty` jadi false, `markWindowClean` dipanggil, judul jendela di-update.
*   **Dependencies**: `Window.jsx` (menerima `context` termasuk `updateTitle`), `SaveAsDialog.jsx` (melalui `desktopStore`), Headless UI (`Menu`).
*   **Poin Presentasi Penting**:
    *   Manajemen state `isDirty` dan integrasinya dengan `desktopStore` (`dirtyWindowIds`, `markWindowDirty/Clean`).
    *   Alur kerja "Save" vs "Save As" dan interaksi dengan `SaveAsDialog`.
    *   Bagaimana judul jendela di-update secara dinamis untuk mencerminkan nama file dan status dirty.
    *   Implementasi nomor baris dan sinkronisasi scroll.

### 4. `Terminal.jsx` (Aplikasi Terminal)

*   **Kontributor**: (Siapa yang membuat Terminal)
*   **Core Responsibilities**:
    *   Mensimulasikan antarmuka baris perintah (CLI) untuk berinteraksi dengan file system simulasi.
    *   Mendukung perintah dasar seperti `ls`, `cd`, `mkdir`, `touch`, `cat`, `rm`, `mv`, `cp`, `pwd`, `echo`, `clear`, `help`.
    *   Menyediakan histori perintah dan fitur auto-completion dasar.
*   **Key Interactions with `desktopStore`**:
    *   **Membaca**: `cwd` (Current Working Directory), `fs` (untuk `ls` dan auto-completion).
    *   **Actions Dipanggil**: `setCwd`, `listDirectory`, `createDirectory`, `createFile`, `deleteItem`, `readFile`, `writeFile`, `moveItem`, `copyItem`.
*   **Key Internal Logic/State**:
    *   `history`: Array string/objek yang merepresentasikan output yang ditampilkan.
    *   `input`: Teks yang sedang diketik pengguna.
    *   `commandHistory`, `historyIndex`: Untuk navigasi histori perintah dengan panah atas/bawah.
    *   `handleInputSubmit`: Fungsi utama yang mem-parse input, menjalankan perintah (via `switch` statement), dan memperbarui `history`.
    *   Logika auto-completion (Tab): Memeriksa apakah kursor pada posisi perintah atau argumen, mencocokkan dengan daftar perintah atau isi direktori saat ini.
    *   Animasi baris output menggunakan Framer Motion.
*   **User Interaction Flow (Contoh: `ls` dan `cd`)**:
    1.  Pengguna ketik `ls`, tekan Enter.
    2.  `handleInputSubmit` mem-parse perintah `ls`.
    3.  Memanggil `listDirectory(cwd)` dari `desktopStore`.
    4.  Hasilnya diformat dan ditambahkan ke state `history` Terminal.
    5.  Pengguna ketik `cd MyFolder`, tekan Enter.
    6.  `handleInputSubmit` mem-parse perintah `cd` dan argumen `MyFolder`.
    7.  Memanggil `setCwd('MyFolder')` dari `desktopStore`.
    8.  `desktopStore` memperbarui state `cwd`.
    9.  Prompt Terminal berikutnya akan menampilkan CWD yang baru.
*   **Poin Presentasi Penting**:
    *   Bagaimana perintah pengguna di-parse dan dipetakan ke aksi di `desktopStore`.
    *   Implementasi output `ls` yang diformat.
    *   Mekanisme auto-completion untuk perintah dan path.
    *   Pengelolaan histori perintah.

### 5. `Settings.jsx` (Aplikasi Pengaturan)

*   **Kontributor**: (Siapa yang membuat Settings)
*   **Core Responsibilities**:
    *   Menyediakan antarmuka pengguna untuk mengubah berbagai pengaturan aplikasi yang disimpan di `desktopStore.js`.
    *   Pengaturan meliputi: Latar Belakang Desktop, Mode Night Light, Kunci Taskbar, Pengaturan File Explorer (tampilan default, file tersembunyi).
*   **Key Interactions with `desktopStore`**:
    *   **Membaca**: `desktopBackground`, `isNightLightEnabled`, `isTaskbarLocked`, `fileExplorerSettings`.
    *   **Actions Dipanggil**: `setDesktopBackground`, `toggleNightLight`, `toggleTaskbarLock`, `setFileExplorerSetting`, `updateFileExplorerSettings`.
*   **Key Internal Logic/State**:
    *   `activeSection`: State lokal untuk melacak bagian pengaturan mana yang sedang ditampilkan.
    *   `renderSectionContent()`: Fungsi yang merender UI untuk bagian pengaturan yang aktif.
    *   Untuk upload gambar latar belakang: Menggunakan input file tersembunyi dan `FileReader` API untuk membaca gambar sebagai Data URL sebelum menyimpannya ke store.
*   **User Interaction Flow (Contoh: Mengubah Latar Belakang)**:
    1.  Pengguna navigasi ke bagian "Display" di Settings.
    2.  Pengguna memilih salah satu opsi gradient -> `setDesktopBackground({ type: 'gradient', value: 'gradient-1' })` dipanggil.
    3.  Atau, pengguna upload gambar -> `handleFileChange` membaca file, memvalidasi, lalu memanggil `setDesktopBackground({ type: 'custom', customUrl: imageDataUrl })`.
    4.  `desktopStore` memperbarui state `desktopBackground`.
    5.  Komponen `Desktop.jsx` (yang subscribe ke `desktopBackground`) akan re-render dan menampilkan latar belakang baru.
*   **Poin Presentasi Penting**:
    *   Struktur UI dengan sidebar navigasi dan area konten dinamis.
    *   Bagaimana setiap kontrol UI (toggle, radio button, file input) langsung memanggil action di `desktopStore` untuk memperbarui pengaturan secara real-time.
    *   Integrasi dengan `localStorage` via `persist` middleware di `desktopStore` membuat pengaturan ini bertahan.

### 6. Komponen Visual Inti (`Desktop.jsx`, `Taskbar.jsx`, `Window.jsx`)

*   **Kontributor**: (Siapa yang mengerjakan komponen UI inti ini)
*   **`Desktop.jsx`**: Bertindak sebagai container utama. Merender Taskbar, semua `DraggableDesktopIcon`, dan semua `Window` (untuk aplikasi yang terbuka dan tidak diminimalkan). Mengelola latar belakang dan menampilkan modal global (`ConfirmModal`, `SaveAsDialog`) serta notifikasi (`Toaster`). Menggunakan `getAppComponent` untuk merender konten aplikasi di dalam jendela.
*   **`Taskbar.jsx`**: Menampilkan tombol Start, ikon aplikasi yang berjalan/di-pin, dan system tray. Mengelola logika klik pada tombol aplikasi (membuka, meminimalkan, membawa ke depan). Menampilkan `ContextMenu` untuk taskbar dan tombol aplikasi. Mengelola visibilitas panel system tray (`DateTimeWidget`, `VolumeControl`, `WifiPanel`).
*   **`Window.jsx`**: Komponen generik untuk setiap jendela aplikasi. Menggunakan `react-draggable` dan `react-resizable` untuk fungsionalitas drag & resize. Menampilkan header dengan judul dan tombol kontrol (minimize, maximize, close). Memanggil `bringToFront` saat diklik. Menerima `children` (komponen aplikasi) dan melewatkan `context` (seperti `updateTitle` callback).
*   **Key Interactions with `desktopStore`**: Sangat banyak. Membaca daftar ikon, jendela, status Start Menu, pengaturan taskbar, dll. Memanggil actions seperti `openWindow`, `closeWindow`, `toggleMinimize`, `bringToFront`, `moveIcon`, `toggleStartMenu`.
*   **Poin Presentasi Penting**:
    *   Bagaimana `Desktop.jsx` mengatur dan merender semua elemen UI utama secara dinamis berdasarkan state dari `desktopStore`.
    *   Penggunaan Framer Motion (`AnimatePresence`, `motion.div`) untuk animasi jendela, Start Menu, dan panel.
    *   Logika di `Taskbar.jsx` untuk menampilkan tombol aplikasi yang relevan dan menangani interaksinya.
    *   Bagaimana `Window.jsx` menyediakan fungsionalitas jendela generik untuk semua aplikasi.
    *   Alur bagaimana `getAppComponent` di `Desktop.jsx` digunakan untuk men-translasikan `iconId` menjadi komponen aplikasi yang sebenarnya untuk dirender di dalam `Window.jsx`.

### 7. `ImageViewer.jsx` (Aplikasi Penampil Gambar)

*   **Kontributor**: (Siapa yang membuat ImageViewer)
*   **Core Responsibilities**:
    *   Menampilkan file gambar yang dibuka dari File Explorer.
    *   Menyediakan fungsionalitas dasar untuk interaksi dengan gambar: zoom, pan (geser), rotasi, reset tampilan, dan fit to screen.
*   **Key Interactions with `desktopStore`**:
    *   **Membaca**: `readFile(filePath)` untuk mendapatkan data gambar (diasumsikan sebagai Data URL).
    *   **Actions Dipanggil**: Tidak ada actions store yang dipanggil secara langsung untuk memodifikasi state global, selain interaksi standar window (close, minimize, dll yang ditangani `Window.jsx`).
*   **Key Internal Logic/State**:
    *   `imageDataUrl`: Menyimpan Data URL gambar yang akan ditampilkan.
    *   `isLoading`, `error`: Untuk status loading gambar.
    *   `zoom`: Level zoom saat ini.
    *   `pan`: Objek `{x, y}` untuk posisi pan gambar.
    *   `isPanning`: Boolean untuk menandakan apakah pengguna sedang menggeser gambar.
    *   `rotation`: Derajat rotasi gambar.
    *   `naturalDimensions`: Dimensi asli gambar setelah dimuat.
    *   `showControls`: Boolean untuk menampilkan/menyembunyikan kontrol gambar.
    *   **Loading**: `useEffect` untuk memanggil `readFile` saat `filePath` (dari context `Window.jsx`) berubah. Menggunakan `new Image()` untuk mendapatkan dimensi natural.
    *   **Transformasi CSS**: Menggunakan `transform: translate() scale() rotate()` pada tag `<img>` untuk menerapkan zoom, pan, dan rotasi.
    *   **Kontrol Interaktif**: Fungsi-fungsi untuk `handleZoomIn`, `handleZoomOut`, `handleResetView`, `handleRotate`, `handleFitToScreen`.
    *   **Panning Logic**: Event handlers `handleMouseDown`, `handleMouseMove`, `handleMouseUpOrLeave` untuk implementasi geser gambar.
    *   **Wheel Zoom**: Event listener `wheel` untuk zoom dengan mouse wheel.
    *   **Keyboard Shortcuts**: Untuk zoom, reset, jika jendela aktif.
*   **User Interaction Flow (Contoh: Zoom dan Pan)**:
    1.  Pengguna membuka file gambar -> `ImageViewer` dimuat dengan gambar.
    2.  Pengguna menggunakan tombol zoom atau mouse wheel -> State `zoom` diperbarui, CSS transform pada gambar berubah.
    3.  Jika gambar di-zoom lebih besar dari area tampilan, pengguna dapat klik-tahan dan geser mouse -> State `pan` diperbarui, CSS transform `translate()` berubah.
*   **Dependencies**: `Window.jsx` (menerima `filePath` via `context`).
*   **Poin Presentasi Penting**:
    *   Bagaimana gambar dimuat secara asinkron dan dimensi naturalnya didapatkan.
    *   Implementasi zoom, pan, dan rotasi menggunakan CSS transforms dan state React.
    *   Logika untuk kontrol interaktif (tombol, mouse wheel, drag-to-pan).
    *   Manajemen tampilan kontrol gambar (muncul/hilang otomatis).

### 8. Sistem Modal Dialog (`modal/`)

*   **Kontributor**: (Siapa yang mengembangkan sistem modal atau modal utama seperti `SaveAsDialog`)
*   **Core Responsibilities**:
    *   Menyediakan komponen UI yang dapat digunakan kembali untuk menampilkan dialog modal yang memblokir interaksi dengan bagian lain aplikasi sampai ditutup.
    *   Digunakan untuk konfirmasi (`ConfirmModal`), input sederhana (`InputModal`), dialog penyimpanan file kompleks (`SaveAsDialog`), dan tampilan informasi (`SimpleDisplayModal`).
*   **Key Interactions with `desktopStore`**:
    *   Visibilitas dan data awal untuk modal global (seperti `ConfirmModal` dan `SaveAsDialog`) seringkali dikelola dalam state di `desktopStore` (misalnya, `confirmationModal.isOpen`, `saveAsDialog.onSave`).
    *   Actions di `desktopStore` (misalnya, `showConfirmation`, `openSaveAsDialog`, `closeSaveAsDialog`) digunakan untuk mengontrol modal ini dari berbagai bagian aplikasi.
*   **Key Components & Logic**:
    *   **`Modal.jsx` (Dasar)**: Menyediakan kerangka umum (overlay, kontainer tengah, judul, tombol tutup opsional). Menangani penutupan saat klik di luar.
    *   **Turunan Spesifik**: `InputModal`, `ConfirmModal`, `SaveAsDialog`, `SimpleDisplayModal` membangun di atas `Modal.jsx` atau mengimplementasikan strukturnya sendiri dengan logika spesifik untuk jenis interaksi tertentu.
    *   **`SaveAsDialog.jsx`**: Contoh paling kompleks, melibatkan navigasi tree direktori internal (menggunakan `DirectoryNode.jsx` rekursif), input nama file, dan validasi sebelum memanggil callback `onSave`.
    *   **Animasi**: Umumnya menggunakan `AnimatePresence` dan `motion.div` untuk animasi masuk/keluar, biasanya dikelola di komponen yang memanggil modal (`Desktop.jsx`) atau di dalam modal yang lebih kompleks.
*   **User Interaction Flow (Contoh: `ConfirmModal` untuk menghapus file)**:
    1.  Pengguna mencoba menghapus file di `FileExplorer`.
    2.  `FileExplorer` memanggil `showConfirmation(title, message, onConfirmCallback)` dari `desktopStore`.
    3.  `desktopStore` memperbarui state `confirmationModal` menjadi `{ isOpen: true, ... }`.
    4.  `Desktop.jsx` (yang merender `ConfirmModal` berdasarkan state ini) menampilkan modal.
    5.  Pengguna mengklik "Confirm" -> `onConfirmCallback` (yang asli dari `FileExplorer`) dijalankan, yang kemudian memanggil `deleteItem` dari store.
    6.  `hideConfirmation` dipanggil untuk menutup modal.
*   **Poin Presentasi Penting**:
    *   Pola umum untuk mengelola state modal (seringkali di store global untuk modal yang dapat dipicu dari mana saja).
    *   Kegunaan komponen `Modal.jsx` sebagai dasar.
    *   Struktur dan logika kompleks dari `SaveAsDialog` sebagai studi kasus (navigasi FS internal, validasi, callback).
    *   Penggunaan `AnimatePresence` untuk pengalaman pengguna yang lebih baik.

### 9. Fungsionalitas Drag and Drop (D&D)

*   **Kontributor**: (Siapa yang mengimplementasikan D&D utama untuk ikon, jendela, atau di File Explorer)
*   **Core Responsibilities**:
    *   Memungkinkan pengguna untuk memindahkan elemen UI (ikon desktop, jendela aplikasi) secara visual.
    *   Memungkinkan operasi file melalui D&D di `FileExplorer` (memindahkan file antar folder, atau dari OS host ke aplikasi).
*   **Teknologi & Implementasi Kunci**:
    *   **`react-draggable`**: Digunakan di `DraggableDesktopIcon.jsx` dan `Window.jsx`.
        *   Menyederhanakan implementasi pemindahan elemen.
        *   `onStop` callback digunakan untuk memperbarui posisi elemen di `desktopStore` (`moveIcon`, `moveWindow`).
        *   Opsi seperti `handle` (untuk menentukan area drag) dan `bounds` (untuk membatasi area drag) sangat berguna.
    *   **D&D Kustom di `FileExplorer.jsx`**:
        *   **Internal D&D (item ke folder)**: Menggunakan atribut HTML5 `draggable` pada item. Event handlers `onDragStart`, `onDragOver`, `onDrop`, `onDragLeave` diimplementasikan pada item dan target folder untuk mengelola state drag (`draggedItemNames`, `dragOverFolderName`) dan memanggil aksi store (`moveItem`) saat drop.
        *   **D&D ke `FileTreeSidebar.jsx`**: Mirip dengan D&D internal, tapi target drop adalah node direktori di sidebar.
        *   **D&D dari OS Host**: Event handlers `onDragEnter`, `onDragOver`, `onDragLeave`, `onDrop` pada container File Explorer.
            *   Menggunakan `event.dataTransfer.files` untuk mengakses file yang di-drag dari OS.
            *   `FileReader` API (asinkron) digunakan untuk membaca konten file (gambar sebagai Data URL, teks sebagai plain text).
            *   Memanggil `createFile` dari `desktopStore` untuk menambahkan file ke FS simulasi.
*   **User Interaction Flow (Contoh: Memindahkan ikon desktop)**:
    1.  Pengguna klik-tahan pada `DraggableDesktopIcon`.
    2.  `react-draggable` mengambil alih dan menampilkan visual pemindahan.
    3.  Pengguna melepas tombol mouse.
    4.  Callback `onStop` dari `<Draggable>` dipicu, mengirimkan posisi baru.
    5.  `DraggableDesktopIcon` memanggil `moveIcon(iconId, newPosition)` dari `desktopStore`.
    6.  `desktopStore` memperbarui posisi ikon di state `icons`.
    7.  Ikon tetap di posisi baru (karena `defaultPosition` pada render berikutnya akan mengambil dari store).
*   **Poin Presentasi Penting**:
    *   Perbedaan antara menggunakan library seperti `react-draggable` untuk D&D elemen UI umum dan implementasi D&D HTML5 kustom untuk skenario yang lebih kompleks (seperti di File Explorer).
    *   Bagaimana D&D di File Explorer menangani berbagai sumber (internal, OS) dan target (folder di main view, folder di sidebar).
    *   Penggunaan `FileReader` untuk mengimpor file dari OS host dan tantangan asinkronnya.
    *   Pentingnya feedback visual selama operasi D&D (misalnya, menyorot target drop).

### 10. Sistem Menu Konteks (`ContextMenu.jsx`)

*   **Kontributor**: (Siapa yang membuat komponen `ContextMenu.jsx` atau mengintegrasikannya secara luas)
*   **Core Responsibilities**:
    *   Menyediakan komponen UI generik dan dapat digunakan kembali untuk menampilkan menu klik kanan (konteks) di berbagai bagian aplikasi.
    *   Konten menu bersifat dinamis, tergantung pada elemen yang diklik kanan.
*   **Key Interactions with `desktopStore`**:
    *   State untuk `ContextMenu` itu sendiri (`contextMenu: { visible, x, y, items, ... }`) dikelola di `desktopStore`.
    *   Komponen yang ingin menampilkan menu konteks (misalnya, `Desktop.jsx`, `Taskbar.jsx`, `FileExplorer.jsx`) akan memanggil sebuah action atau langsung mem-set state `contextMenu` di store dengan item menu yang relevan dan koordinat.
*   **Key Component Logic (`ContextMenu.jsx`)**:
    *   **Props**: Menerima `x`, `y` (posisi), `items` (array objek menu: `{ label, onClick, disabled?, separator? }`), `onClose`.
    *   **Rendering**: Dirender sebagai `div` yang diposisikan secara absolut (atau fixed) berdasarkan `x`, `y`.
    *   **Item Menu**: Setiap item dirender sebagai tombol atau pemisah. `onClick` handler dari item dipanggil saat diklik.
    *   **Auto-Close**: `useEffect` menambahkan event listener global (`mousedown`, `keydown` untuk Escape) untuk menutup menu secara otomatis saat pengguna mengklik di luar atau menekan Escape. Listener ini dibersihkan saat unmount.
    *   Mencegah menu konteks browser default muncul di atasnya (`e.preventDefault()` pada `onContextMenu`).
*   **User Interaction Flow (Contoh: Klik kanan di Desktop)**:
    1.  Pengguna klik kanan pada `Desktop.jsx`.
    2.  Handler `onContextMenu` di `Desktop.jsx` dipicu.
    3.  Handler ini membuat daftar item menu yang relevan (misalnya, "New Folder", "Display settings").
    4.  Handler memanggil `setContextMenu({ visible: true, x: e.clientX, y: e.clientY, items: desktopMenuItems, ... })` dari `desktopStore`.
    5.  `Desktop.jsx` merender `<ContextMenu ... />` karena state `contextMenu.visible` sekarang true.
    6.  Pengguna mengklik item menu, misalnya "New Folder".
    7.  `onClick` callback untuk "New Folder" dijalankan (misalnya, membuka `InputModal`).
    8.  `onClose` dari `ContextMenu` (yang memanggil `setContextMenu({ visible: false, ... })`) dipanggil, menyembunyikan menu.
*   **Poin Presentasi Penting**:
    *   Desain generik dari `ContextMenu.jsx` yang memungkinkannya digunakan kembali di banyak tempat.
    *   Bagaimana state menu konteks (visibilitas, posisi, item) dikelola secara terpusat (di `desktopStore`).
    *   Mekanisme untuk menutup menu secara otomatis.
    *   Contoh bagaimana komponen berbeda (Desktop, Taskbar, File Explorer) menyediakan set item menu yang berbeda untuk konteksnya masing-masing.

## Konsep Teknis Dasar (Untuk Pemula)

Bagian ini menjelaskan beberapa konsep teknis dasar yang relevan dengan proyek ini, ditujukan untuk mereka yang mungkin baru dalam pengembangan web modern atau React.

*   **DOM (Document Object Model)**:
    *   DOM adalah representasi terstruktur dari dokumen HTML (atau XML) dalam bentuk pohon objek. Setiap elemen, atribut, dan teks dalam HTML menjadi sebuah "node" di pohon DOM.
    *   Browser menggunakan DOM untuk merender halaman web. JavaScript dapat berinteraksi dengan DOM untuk membaca atau memodifikasi konten, struktur, dan style halaman secara dinamis.
    *   Contoh: Mengubah teks sebuah paragraf, menambah elemen baru, atau mengubah warna tombol.

*   **Virtual DOM (VDOM)**:
    *   Memanipulasi DOM secara langsung seringkali lambat dan mahal secara performa.
    *   React menggunakan Virtual DOM, yang merupakan representasi ringan dari DOM aktual yang disimpan di memori.
    *   Ketika state sebuah komponen React berubah, React pertama-tama membuat VDOM baru yang merefleksikan perubahan tersebut.
    *   Kemudian, React membandingkan VDOM baru ini dengan VDOM sebelumnya (proses ini disebut "diffing" atau "reconciliation").
    *   React lalu menghitung cara paling efisien untuk memperbarui DOM aktual agar sesuai dengan VDOM baru, hanya menerapkan perubahan yang benar-benar diperlukan. Ini membuat pembaruan UI jauh lebih cepat.

*   **JSX (JavaScript XML)**:
    *   JSX adalah ekstensi sintaks untuk JavaScript yang memungkinkan penulisan struktur mirip HTML langsung di dalam kode JavaScript. Ini bukan HTML murni, melainkan "gula sintaksis" untuk `React.createElement()`.
    *   Contoh: `const element = <h1>Hello, world!</h1>;` akan diubah (ditranspilasi) menjadi pemanggilan fungsi JavaScript.
    *   Membuat penulisan komponen React menjadi lebih intuitif dan mudah dibaca karena mirip dengan struktur UI yang diinginkan.

*   **Komponen React**:
    *   Unit dasar pembangun UI di React. Komponen adalah potongan kode independen yang dapat digunakan kembali, bertanggung jawab untuk merender sebagian dari UI.
    *   Bisa berupa fungsi JavaScript (Functional Components, yang paling umum digunakan saat ini) atau kelas ES6 (Class Components).
    *   Menerima input berupa `props` dan dapat memiliki `state` internal.

*   **Props (Properties)**:
    *   Cara komponen menerima data dari komponen induknya. Props bersifat read-only (tidak boleh diubah oleh komponen penerima).
    *   Mekanisme untuk kustomisasi dan konfigurasi komponen.
    *   Contoh: `<Button label="Klik Saya" color="blue" />`. Di sini, `label` dan `color` adalah props untuk komponen `Button`.

*   **State**:
    *   Data internal yang dikelola oleh sebuah komponen. State dapat berubah seiring waktu sebagai respons terhadap interaksi pengguna atau event lainnya.
    *   Ketika state sebuah komponen berubah, React secara otomatis akan me-render ulang komponen tersebut (dan anak-anaknya jika perlu) untuk mencerminkan state baru.
    *   **State Lokal (React `useState` Hook)**: Digunakan untuk data yang hanya relevan bagi satu komponen dan tidak perlu dibagikan.
    *   **State Global (Zustand)**: Digunakan untuk data yang perlu diakses atau dimodifikasi oleh banyak komponen di berbagai bagian aplikasi (misalnya, daftar jendela yang terbuka, pengaturan pengguna). `desktopStore.js` adalah contoh state global dalam proyek ini.

*   **React Hooks**:
    *   Fitur yang memungkinkan penggunaan state dan fitur React lainnya di dalam Functional Components (tanpa perlu menulis Class Components).
    *   Beberapa hook bawaan yang penting:
        *   **`useState`**: Untuk menambahkan state lokal ke komponen. Mengembalikan pasangan nilai: state saat ini dan fungsi untuk memperbaruinya. Contoh: `const [count, setCount] = useState(0);`. Digunakan secara luas untuk mengelola data internal komponen yang tidak perlu global.
        *   **`useEffect`**: Untuk menjalankan "side effects" setelah rendering (misalnya, mengambil data, berlangganan event, memanipulasi DOM secara manual, mengatur timer). Dapat juga membersihkan efek tersebut (misalnya, membatalkan langganan event, membersihkan timer) dengan mengembalikan sebuah fungsi. Contoh: `useEffect(() => { document.title = \`Anda klik \${count} kali\`; return () => { /* cleanup */ }; }, [count]);`. Dependency array (`[count]`) menentukan kapan efek dijalankan ulang.
        *   **`useContext`**: Untuk mengakses data dari React Context API (cara lain untuk berbagi state tanpa prop drilling, meskipun Zustand adalah pilihan utama untuk state global di proyek ini). Contoh: `const theme = useContext(ThemeContext);`.
        *   **`useRef`**: Untuk mendapatkan referensi langsung ke elemen DOM (misalnya, untuk memfokuskan input atau mengukur ukuran elemen) atau untuk menyimpan nilai mutable yang tidak memicu re-render saat diubah. Contoh: `const inputEl = useRef(null); inputEl.current.focus();`.
        *   **`useMemo`**: Untuk memoizing (mengingat) hasil kalkulasi yang mahal. Fungsi yang dilewatkan ke `useMemo` hanya akan dijalankan ulang jika salah satu dependencies-nya berubah. Ini berguna untuk optimasi performa. Contoh: `const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);`.
        *   **`useCallback`**: Untuk memoizing fungsi callback. Ini berguna ketika melewatkan callback ke komponen anak yang dioptimalkan (misalnya, dengan `React.memo`) untuk mencegah re-render yang tidak perlu karena referensi fungsi berubah setiap render. Contoh: `const memoizedCallback = useCallback(() => { doSomething(a, b); }, [a, b]);`.
    *   Pengembang juga dapat membuat **Custom Hooks** untuk mengekstrak logika komponen yang dapat digunakan kembali (misalnya, hook untuk menangani input form, hook untuk mengambil data dari API, atau hook untuk mengelola logika UI tertentu).

*   **Immutability (Keabadian)**:
    *   Konsep di mana data tidak diubah setelah dibuat. Setiap kali perubahan diperlukan, salinan baru dari data dibuat dengan perubahan tersebut, sementara data asli tetap tidak tersentuh.
    *   **Mengapa penting di React/Zustand?**: React menggunakan perbandingan referensi (shallow comparison) untuk mendeteksi perubahan state atau props. Jika Anda memodifikasi objek atau array secara langsung (mutasi), referensinya tidak berubah, sehingga React mungkin tidak mendeteksi perubahan dan tidak me-render ulang UI.
    *   Dengan immutability, setiap perubahan menghasilkan objek/array baru dengan referensi baru, memudahkan React untuk mendeteksi perubahan.
    *   **Immer**: Library yang digunakan bersama Zustand dalam proyek ini untuk menyederhanakan pembaruan state yang immutable. Immer memungkinkan Anda menulis kode seolah-olah Anda melakukan mutasi langsung pada "draft" state, dan Immer akan secara otomatis menghasilkan state baru yang immutable di belakang layar.

*   **Store (dalam konteks State Management)**:
    *   Sebuah objek JavaScript terpusat yang menyimpan state global aplikasi.
    *   Komponen dapat "berlangganan" (subscribe) ke bagian tertentu dari store. Ketika bagian state tersebut berubah, hanya komponen yang berlangganan yang akan di-render ulang.
    *   Zustand menyediakan fungsi `create` untuk membuat store. Store ini berisi state dan "actions" (fungsi untuk memodifikasi state).
    *   Dalam proyek ini, `desktopStore.js` adalah store utama.

*   **Event Handling di React**:
    *   Mirip dengan event handling di HTML DOM, tetapi dengan beberapa perbedaan sintaks (misalnya, event ditulis dalam camelCase seperti `onClick`, dan Anda meneruskan fungsi sebagai event handler daripada string).
    *   React menggunakan "synthetic events", yang merupakan wrapper di sekitar event asli browser untuk memastikan konsistensi perilaku di semua browser.
    *   Contoh: `<button onClick={handleClick}>Klik Saya</button>`.

*   **Component Lifecycle (Singkat)**:
    *   Meskipun hooks seperti `useEffect` kini menangani banyak aspek lifecycle, konsep dasarnya adalah bahwa komponen memiliki beberapa fase: Mounting (ditambahkan ke DOM), Updating (di-render ulang karena perubahan props/state), dan Unmounting (dihapus dari DOM).
    *   `useEffect` dapat meniru perilaku ini. Misalnya, `useEffect(() => { /* mounting & updating */ return () => { /* unmounting */ } }, [dependencies]);`.

*   **Asynchronous Operations (Operasi Asinkron)**:
    *   JavaScript secara default bersifat single-threaded, artinya ia menjalankan satu operasi pada satu waktu. Operasi asinkron memungkinkan program untuk memulai tugas yang memakan waktu (seperti mengambil data dari server, membaca file, atau timer) tanpa memblokir thread utama.
    *   **Promises**: Objek yang merepresentasikan penyelesaian (atau kegagalan) eventual dari operasi asinkron. Promise memiliki state: `pending`, `fulfilled` (berhasil), atau `rejected` (gagal). Metode `.then()` digunakan untuk menangani hasil sukses, dan `.catch()` untuk menangani error.
    *   **`async/await`**: Sintaks yang dibangun di atas Promises untuk membuat kode asinkron terlihat dan berperilaku sedikit lebih seperti kode sinkron, membuatnya lebih mudah dibaca. Fungsi yang dideklarasikan dengan `async` secara implisit mengembalikan Promise. Keyword `await` digunakan di dalam fungsi `async` untuk menunggu Promise selesai.
    *   Contoh: `async function fetchData() { try { const response = await fetch(\'/api/data\'); const data = await response.json(); console.log(data); } catch (error) { console.error(\'Gagal fetch data:\', error); } }`.
    *   Dalam proyek ini, `FileReader` API (digunakan di File Explorer untuk membaca file yang di-drag dari OS) adalah contoh operasi asinkron yang berbasis event callback, yang bisa juga di-wrap dalam Promise jika diinginkan.

*   **Styling di React**:
    *   Ada banyak cara untuk menata gaya komponen React. Proyek ini menggunakan kombinasi:
        *   **Tailwind CSS**: Framework utility-first CSS yang utama. Kelas utilitas diterapkan langsung di JSX (misalnya, `<div className="bg-blue-500 p-4">`). Ini mempercepat pengembangan dan menjaga konsistensi.
        *   **File CSS Global/Spesifik**: `index.css` berisi impor Tailwind dan beberapa style global. `App.css` berisi style spesifik lainnya. Ini berguna untuk style yang sulit dicapai hanya dengan utilitas atau untuk menargetkan elemen yang tidak langsung dikontrol React.
        *   Metode lain yang umum (tidak dominan di sini): CSS Modules (file CSS lokal per komponen), CSS-in-JS (library seperti Styled Components atau Emotion).

*   **Error Handling (Dasar)**:
    *   Penanganan error penting untuk aplikasi yang tangguh. Beberapa pendekatan dasar di React/JavaScript:
        *   **`try...catch` blocks**: Untuk menangani error dari kode sinkron atau dari `await`-ing Promises.
        *   **`.catch()` pada Promises**: Untuk menangani error yang terjadi dalam rantai Promise.
        *   **Validasi Input**: Mencegah error dengan memvalidasi input pengguna sebelum diproses.
        *   **Conditional Rendering**: Menampilkan pesan error atau UI alternatif berdasarkan state error.
        *   **Error Boundaries (React)**: Komponen React khusus yang menangkap error JavaScript di mana saja dalam tree komponen anaknya, mencatat error tersebut, dan menampilkan UI fallback daripada membuat seluruh aplikasi crash. Proyek ini mungkin belum secara eksplisit menggunakan Error Boundaries, tetapi ini adalah konsep penting untuk aplikasi React yang lebih besar.