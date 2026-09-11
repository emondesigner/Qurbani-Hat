import React, { createContext, useContext, useState, useEffect, ReactNode, MouseEvent } from 'react';

interface RouterContextType {
  path: string;
  navigate: (to: string) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType | null>(null);

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  const [currentUrl, setCurrentUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname + window.location.search;
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentUrl(window.location.pathname + window.location.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      if (to !== window.location.pathname + window.location.search) {
        window.history.pushState({}, '', to);
        setCurrentUrl(to);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const [pathOnly, searchOnly] = currentUrl.split('?');
  const searchParams = new URLSearchParams(searchOnly || '');

  // Dynamic route parameter extraction (e.g. /details-page/:id)
  const params: Record<string, string> = {};
  const detailsMatch = pathOnly.match(/^\/details-page\/([^/]+)/);
  if (detailsMatch) {
    params.id = detailsMatch[1];
  }

  return (
    <RouterContext.Provider
      value={{
        path: pathOnly || '/',
        navigate,
        params,
        searchParams,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function Link({ href, children, className = '', id, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
    }
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !e.metaKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.shiftKey &&
      !href.startsWith('http') &&
      !href.startsWith('#')
    ) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a href={href} id={id} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}
