import { usePackingStore } from '../store/packingStore';
import { tr } from '../locales/tr';
import { en } from '../locales/en';

export function useTranslation() {
    const language = usePackingStore((state) => state.settings.language);
    const t = language === 'tr' ? tr : en;
    return { t, language };
}
