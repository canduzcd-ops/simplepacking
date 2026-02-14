import { ThemeColor } from "../types";

export const SUGGESTIONS: Record<ThemeColor, string[]> = {
    neutral: [
        "Cüzdan", "Anahtar", "Telefon", "Şarj Aleti", "Kulaklık", "Gözlük", "Su Şişesi", "Maske"
    ],
    work: [
        "Laptop", "Şarj Aleti", "Not Defteri", "Kalem", "Kartvizitler", "Sunum Dosyası", "Powerbank", "Usb Bellek"
    ],
    sport: [
        "Havlu", "Su", "Yedek Tişört", "Spor Ayakkabı", "Deodorant", "Protein Bar", "Kilit", "Kulaklık"
    ],
    travel: [
        "Pasaport", "Biletler", "Diş Fırçası", "Diş Macunu", "Şampuan", "İç Çamaşırı", "Çorap", "Pijama", "Güneş Gözlüğü", "Powerbank"
    ],
    wedding: [
        "Takım Elbise/Elbise", "Ayakkabı", "Takılar", "Davetiye", "Parfüm", "Makyaj Malzemeleri", "Tıraş Takımı", "Hediye"
    ]
};

export const CATEGORIES = [
    { id: 'cat_clothes', nameKey: 'Kıyafet', icon: '👕' },
    { id: 'cat_tech', nameKey: 'Teknoloji', icon: '💻' },
    { id: 'cat_care', nameKey: 'Bakım', icon: '🧴' },
    { id: 'cat_docs', nameKey: 'Belgeler', icon: '📄' },
    { id: 'cat_other', nameKey: 'Diğer', icon: '📦' },
];
