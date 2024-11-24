type EventCallback = () => void;

interface Events {
  routeChangeStart: EventCallback[];
  routeChangeComplete: EventCallback[];
  routeChangeError: EventCallback[];
}

export function createEvents() {
  const events: Events = {
    routeChangeStart: [],
    routeChangeComplete: [],
    routeChangeError: [],
  };

  // Monkey patch the next/navigation router
  if (typeof window !== 'undefined') {
    const originalPushState = window.history.pushState;
    window.history.pushState = function() {
      events.routeChangeStart.forEach(cb => cb());
      // @ts-ignore
      const result = originalPushState.apply(this, arguments);
      setTimeout(() => {
        events.routeChangeComplete.forEach(cb => cb());
      }, 100);
      return result;
    };
  }

  return {
    on: (event: keyof Events, callback: EventCallback) => {
      events[event].push(callback);
    },
    off: (event: keyof Events, callback: EventCallback) => {
      events[event] = events[event].filter(cb => cb !== callback);
    },
    emit: (event: keyof Events) => {
      events[event].forEach(callback => callback());
    }
  };
}