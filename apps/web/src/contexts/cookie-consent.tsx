import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type ConsentStatus = "undecided" | "accepted" | "declined";

const CONSENT_STORAGE_KEY = "cookie-consent-status";

type CookieConsentContextType = {
  consentStatus: ConsentStatus;
  isHydrated: boolean;
  acceptCookies: () => void;
  declineCookies: () => void;
  resetConsent: () => void;
};

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

function getStoredConsent(): ConsentStatus {
  if (typeof window === "undefined") {
    return "undecided";
  }

  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);

  if (stored === "accepted" || stored === "declined") {
    return stored;
  }

  return "undecided";
}

function setStoredConsent(status: ConsentStatus): void {
  if (typeof window === "undefined") {
    return;
  }

  if (status === "undecided") {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } else {
    localStorage.setItem(CONSENT_STORAGE_KEY, status);
  }
}

export function CookieConsentProvider({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [consentStatus, setConsentStatus] =
    useState<ConsentStatus>("undecided");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setConsentStatus(getStoredConsent());
    setIsHydrated(true);
  }, []);

  const acceptCookies = useCallback(() => {
    setConsentStatus("accepted");
    setStoredConsent("accepted");
  }, []);

  const declineCookies = useCallback(() => {
    setConsentStatus("declined");
    setStoredConsent("declined");
  }, []);

  const resetConsent = useCallback(() => {
    setConsentStatus("undecided");
    setStoredConsent("undecided");
  }, []);

  return (
    <CookieConsentContext.Provider
      value={{
        consentStatus,
        isHydrated,
        acceptCookies,
        declineCookies,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);

  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }

  return context;
}
