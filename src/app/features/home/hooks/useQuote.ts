import { useState } from "react";
import { QuotesService, type QuotesAPIResponse } from "../services/quotes.service";

export default function useQuote({
  initialQuote,
  initialLoading,
  onNewQuote,
}: {
  initialQuote: string;
  initialLoading: boolean;
  onNewQuote?: () => void;
}) {
  const [quotes, setQuotes] = useState<QuotesAPIResponse[]>([]);
  const [quoteText, setQuoteText] = useState(initialQuote);
  const [isLoading, setIsLoading] = useState(initialLoading);

  // TODO ESPERAR AL SERVICIO
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const service = new QuotesService();
      const q = await service.fetchQuotes();
      setQuotes(Array.isArray(q) ? q : [q]);
      setQuoteText(initialQuote);
      onNewQuote?.();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    quoteText,
    quotes,
    isLoading,
    handleRefresh,
  };
}
