export function getLogoSVG({ size = 28, variant = "mark" }) {
    const svgContent = `
        <defs>
            <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d97706;stop-opacity:1" />
            </linearGradient>
        </defs>
        <path d="M800 300H700 V200 C700 144.77 655.23 100 600 100 H400 C344.77 100 300 144.77 300 200 V300 H200 C144.77 300 100 344.77 100 400 V800 C100 855.23 144.77 900 200 900 H800 C855.23 900 900 855.23 900 800 V400 C900 344.77 855.23 300 800 300 Z M400 200 H600 V300 H400 V200 Z" fill="url(#logo-grad)" />
        <path d="M420 650 L320 550 L250 620 L420 790 L750 460 L680 390 Z" fill="white" />
    `;

    if (variant === "lockup") {
        return `
            <div class="flex items-center gap-2 select-none">
                <svg width="${size}" height="${size}" viewBox="0 0 1024 1024" class="drop-shadow-sm">
                    ${svgContent}
                </svg>
                <span class="font-bold tracking-tight text-slate-800 dark:text-slate-100" style="font-size: ${size * 0.6}px; line-height: 1;">
                    RACA <span class="text-amber-500">Simple Packing</span>
                </span>
            </div>
        `;
    }

    return `
        <svg width="${size}" height="${size}" viewBox="0 0 1024 1024" class="drop-shadow-sm">
            ${svgContent}
        </svg>
    `;
}
