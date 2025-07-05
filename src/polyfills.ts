// Fix for 'global is not defined' error in some libraries like sockjs-client
(window as any).global = window;
