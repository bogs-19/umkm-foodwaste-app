import React, { forwardRef } from 'react';
import { Tag, Clock, Utensils } from 'lucide-react';

export const PromoPoster = forwardRef(({ itemKritis, diskon }, ref) => {
    return (
        <div style={{ position: 'fixed', top: 0, left: '-9999px', zIndex: -50 }}>
            <div
                ref={ref}
                style={{
                    width: '400px',
                    height: '500px', // Tetap 500px untuk rasio IG/WA
                    backgroundColor: '#FFFBEB',
                    backgroundImage: 'radial-gradient(circle at 90% 10%, #FEF3C7 0%, #FFFBEB 50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    color: '#1F2937',
                    boxSizing: 'border-box'
                }}
            >
                {/* Ornamen Latar */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', backgroundColor: '#F59E0B', borderRadius: '50%', opacity: 0.15 }}></div>
                <div style={{ position: 'absolute', bottom: '80px', left: '-80px', width: '200px', height: '200px', backgroundColor: '#10B981', borderRadius: '50%', opacity: 0.1 }}></div>

                {/* Pita Label Atas */}
                <div style={{
                    backgroundColor: '#EF4444',
                    color: 'white',
                    padding: '10px 20px', // <-- Padding diperkecil sedikit
                    borderBottomRightRadius: '24px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '900',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    alignSelf: 'flex-start',
                    boxShadow: '0 4px 6px rgba(239, 68, 68, 0.2)'
                }}>
                    <Clock size={16} color="#ffffff" /> FLASH SALE TERBATAS
                </div>

                {/* Area Konten Utama */}
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 10 }}>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Utensils size={16} color="#F59E0B" />
                        <span style={{ fontSize: '12px', fontWeight: '900', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Penyelamatan Pangan
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '34px', // <-- Ukuran font disesuaikan agar judul panjang aman
                        fontWeight: '900',
                        color: '#111827',
                        margin: '0 0 8px 0', // <-- Margin bawah dirapatkan
                        lineHeight: '1.1',
                        textTransform: 'uppercase',
                        letterSpacing: '-1px'
                    }}>
                        {itemKritis.nama}
                    </h1>

                    <p style={{
                        fontSize: '14px',
                        color: '#4B5563',
                        margin: '0 0 20px 0', // <-- Margin bawah dirapatkan
                        lineHeight: '1.5'
                    }}>
                        Bahan segar kualitas terbaik. Bantu UMKM kami mencegah <span style={{ fontWeight: '900', color: '#EF4444' }}>Food Waste</span> hari ini dan dapatkan penawaran spesial!
                    </p>

                    {/* Kotak Voucher */}
                    <div style={{
                        backgroundColor: '#10B981',
                        borderRadius: '16px',
                        padding: '16px 20px', // <-- Padding voucher dirapatkan
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
                    }}>
                        <div style={{ position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', backgroundColor: '#FFFBEB', borderRadius: '50%' }}></div>
                        <div style={{ position: 'absolute', right: '-12px', top: '50%', transform: 'translateY(-50%)', width: '24px', height: '24px', backgroundColor: '#FFFBEB', borderRadius: '50%' }}></div>

                        <div style={{ marginLeft: '12px', zIndex: 2 }}>
                            <p style={{ fontSize: '11px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.9, fontWeight: '800' }}>Potongan Harga</p>
                            <p style={{ fontSize: '42px', fontWeight: '900', margin: 0, lineHeight: '1' }}>{diskon}%</p>
                        </div>

                        <Tag size={56} color="#ffffff" style={{ opacity: 0.15, position: 'absolute', right: '10px', transform: 'rotate(-15deg)' }} />
                    </div>
                </div>

                {/* Footer Barcode */}
                <div style={{
                    borderTop: '2px dashed #D1D5DB',
                    padding: '16px 24px', // <-- Padding footer dirapatkan agar naik ke atas
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    zIndex: 10
                }}>
                    <div>
                        <p style={{ fontSize: '10px', color: '#6B7280', margin: '0 0 2px 0', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                            Tunjukkan di Kasir
                        </p>
                        <p style={{ fontSize: '16px', fontWeight: '900', color: '#1F2937', margin: 0, letterSpacing: '1px' }}>
                            KODE: SAVE-{diskon}
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                        <div style={{ width: '3px', height: '30px', backgroundColor: '#1F2937' }}></div>
                        <div style={{ width: '6px', height: '30px', backgroundColor: '#1F2937' }}></div>
                        <div style={{ width: '2px', height: '30px', backgroundColor: '#1F2937' }}></div>
                        <div style={{ width: '7px', height: '30px', backgroundColor: '#1F2937' }}></div>
                        <div style={{ width: '4px', height: '30px', backgroundColor: '#1F2937' }}></div>
                        <div style={{ width: '3px', height: '30px', backgroundColor: '#1F2937' }}></div>
                    </div>
                </div>

            </div>
        </div>
    );
});