export const exportToPDF = (filename = "Laporan_UMKM") => {
    console.log(`Menyiapkan dokumen ${filename} untuk diekspor...`);
    window.print();
};