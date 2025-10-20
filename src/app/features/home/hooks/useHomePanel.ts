import { useNavigate } from "react-router";
import { useDreamInput } from "./useDreamInput";
import useQuote from "./useQuote";

interface UseHomePanelProps {
    initialDream?: string;
    maxChars?: number;
    onNewQuote?: () => void;
    quote?: string;
    loadingQuote?: boolean;
    onInterpret?: (dream: string) => void;
    onCustomize?: () => void;
    onBadges?: () => void;
}

export function useHomePanel({
    initialDream = "",
    maxChars = 1200,
    onNewQuote,
    quote = "Lo que no se nombra, se sueña",
    loadingQuote = false,
    onInterpret,
    onCustomize,
    onBadges,
}: UseHomePanelProps) {
    const navigate = useNavigate();

    const { dream, dreamRef, charsLeft, isEmpty, isTooLong, handleTextChange } =
        useDreamInput({ initialDream, maxChars });

    const { quoteText, isLoading: isLoadingQuote, handleRefresh: handleNewQuote } = useQuote({
        initialQuote: quote,
        initialLoading: loadingQuote,
        onNewQuote,
    });

    const handleInterpret = () => {
        if (!isEmpty && !isTooLong) {
            onInterpret?.(dreamRef.current?.value || "");
        }
    };

    const handleCustomize = () => {
        onCustomize?.();
    };

    const handleBadges = () => {
        onBadges?.();
    };

    const handleNavigateHistory = () => {
        navigate("/historial");
    };

    const handleCtaClick = () => {
        console.log("CTA click");
    };

    return {
        dream,
        dreamRef,
        charsLeft,
        isEmpty,
        isTooLong,
        handleTextChange,
        handleInterpret,
        quoteText,
        isLoadingQuote,
        handleNewQuote,
        handleCustomize,
        handleBadges,
        handleNavigateHistory,
        handleCtaClick,
    };
}
