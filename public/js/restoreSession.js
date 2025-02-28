(function restoreSession() {
    try {
        console.log("🔄 Restaurando sesión desde MongoDB...");

        // Restaurar localStorage
        if (window.sessionData.localStorage) {
            Object.entries(window.sessionData.localStorage).forEach(([key, value]) => {
                localStorage.setItem(key, value);
                console.log("✅ localStorage restaurado:", key);
            });
        }

        // Restaurar sessionStorage
        if (window.sessionData.sessionStorage) {
            Object.entries(window.sessionData.sessionStorage).forEach(([key, value]) => {
                sessionStorage.setItem(key, value);
                console.log("✅ sessionStorage restaurado:", key);
            });
        }

        // Restaurar cookies
        if (Array.isArray(window.sessionData.cookies)) {
            window.sessionData.cookies.forEach(({ name, value, path = "/", domain = "" }) => {
                document.cookie = `${name}=${value}; path=${path}; domain=${domain}`;
                console.log("✅ Cookie restaurada:", name);
            });
        }

        console.log("✔️ Sesión restaurada con éxito.");

        // Esperar 2 segundos y redirigir
        setTimeout(() => {
            console.log("➡️ Redirigiendo a BocaSocios...");
            window.location.href = "https://bocasocios.bocajuniors.com.ar/auth/login";
        }, 2000);
    } catch (error) {
        console.error("❌ Error restaurando sesión:", error);
    }
})();
